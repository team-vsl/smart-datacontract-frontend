import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Container,
  Header,
  Input,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
  ColumnLayout,
} from "@cloudscape-design/components";

// Import apis
import * as RulesetAPI from "@/objects/ruleset/api";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type Rule = {
  id: string;
  name: string;
  condition: string;
};

type RulesetContent = {
  rules?: Rule[];
  raw?: string;
};

type ResultData = TRuleset & {
  status: "approved" | "rejected" | "error";
};

type Result = {
  status: "approved" | "rejected" | "error";
  message: string;
  data: ResultData | null;
};

type CheckRulesetProps = {
  rulesets: TRuleset[];
  setRulesets: React.Dispatch<React.SetStateAction<TRuleset[]>>;
};

export function CheckRuleset({ rulesets, setRulesets }: CheckRulesetProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();

  // State cho input và kết quả
  const [rulesetId, setRulesetId] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Sử dụng useMutation để approve ruleset
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.getRulesetById(id);
      if (!ruleset) {
        throw new Error(`Không tìm thấy Ruleset với ID: ${id}`);
      }

      // Approve ruleset và cập nhật state
      const updatedRulesets = await RulesetAPI.approveRuleset(id);
      setRulesets(updatedRulesets);

      // Lấy ruleset đã cập nhật
      return await RulesetAPI.getRulesetById(id);
    },
    onSuccess: (updatedRuleset) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["rulesets"] });

      setResult({
        status: "approved",
        message: `Ruleset ${rulesetId} đã được chấp thuận`,
        data: {
          ...updatedRuleset,
          status: "approved",
        } as ResultData,
      });
    },
    onError: (error: Error) => {
      setResult({
        status: "rejected",
        message: error.message,
        data: {
          id: rulesetId,
          name: "Error",
          state: "rejected",
          createdAt: new Date().toISOString().split("T")[0],
          content: {},
          status: "rejected",
        } as ResultData,
      });
    },
  });

  // Sử dụng useMutation để reject ruleset
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.getRulesetById(id);
      if (!ruleset) {
        throw new Error(`Không tìm thấy Ruleset với ID: ${id}`);
      }

      // Reject ruleset và cập nhật state
      const updatedRulesets = await RulesetAPI.rejectRuleset(
        id,
        "Ruleset không đáp ứng yêu cầu"
      );
      setRulesets(updatedRulesets);

      // Lấy ruleset đã cập nhật
      return await RulesetAPI.getRulesetById(id);
    },
    onSuccess: (updatedRuleset) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["rulesets"] });

      setResult({
        status: "rejected",
        message: `Ruleset ${rulesetId} đã bị từ chối`,
        data: {
          ...updatedRuleset,
          status: "rejected",
        } as ResultData,
      });
    },
    onError: (error: Error) => {
      setResult({
        status: "rejected",
        message: error.message,
        data: {
          id: rulesetId,
          name: "Error",
          state: "rejected",
          createdAt: new Date().toISOString().split("T")[0],
          content: {},
          status: "rejected",
        } as ResultData,
      });
    },
  });

  // Hàm xử lý khi approve ruleset
  const handleApprove = () => {
    if (!rulesetId) return;
    approveMutation.mutate(rulesetId);
  };

  // Hàm xử lý khi reject ruleset
  const handleReject = () => {
    if (!rulesetId) return;
    rejectMutation.mutate(rulesetId);
  };

  return (
    <ExpandableSection
      headerText="Check Ruleset"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <Container header={<Header variant="h3">Tương tác</Header>}>
          <SpaceBetween size="xs" direction="horizontal" alignItems="end">
            <Input
              placeholder="Nhập Ruleset ID hoặc Name"
              value={rulesetId}
              onChange={({ detail }) => setRulesetId(detail.value)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            />
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={
                !rulesetId ||
                approveMutation.isPending ||
                rejectMutation.isPending
              }
              loading={approveMutation.isPending}
            >
              Approve
            </Button>
            <Button
              variant="normal"
              onClick={handleReject}
              disabled={
                !rulesetId ||
                approveMutation.isPending ||
                rejectMutation.isPending
              }
              loading={rejectMutation.isPending}
            >
              Reject
            </Button>
          </SpaceBetween>
        </Container>

        {/* Phần kết quả */}
        <Container header={<Header variant="h3">Kết quả</Header>}>
          {approveMutation.isPending || rejectMutation.isPending ? (
            <StatusIndicator type="loading">
              Đang xử lý yêu cầu...
            </StatusIndicator>
          ) : result ? (
            <SpaceBetween size="m">
              <StatusIndicator
                type={
                  result.status === "approved"
                    ? "success"
                    : result.status === "rejected"
                    ? "error"
                    : "warning"
                }
              >
                {result.message}
              </StatusIndicator>

              {result.data && (
                <Box>
                  <ColumnLayout columns={2} variant="text-grid">
                    <FormField label="ID">{result.data.id}</FormField>
                    <FormField label="Tên">{result.data.name}</FormField>
                    <FormField label="Version">{result.data.version}</FormField>
                    <FormField label="Trạng thái">
                      <StatusIndicator
                        type={
                          result.data.status === "approved"
                            ? "success"
                            : "error"
                        }
                      >
                        {result.data.status}
                      </StatusIndicator>
                    </FormField>

                    {result.data.status === "approved" && (
                      <>
                        <FormField label="Thời gian chấp thuận">
                          {result.data.approvedAt &&
                            new Date(result.data.approvedAt).toLocaleString()}
                        </FormField>
                        <FormField label="Người chấp thuận">
                          {result.data.approvedBy}
                        </FormField>
                      </>
                    )}

                    {result.data.status === "rejected" && (
                      <>
                        <FormField label="Thời gian từ chối">
                          {result.data.rejectedAt &&
                            new Date(result.data.rejectedAt).toLocaleString()}
                        </FormField>
                        <FormField label="Người từ chối">
                          {result.data.rejectedBy}
                        </FormField>
                      </>
                    )}
                  </ColumnLayout>

                  {result.data.reason && (
                    <Box margin={{ top: "m" }}>
                      <FormField label="Lý do từ chối">
                        <Box color="text-status-error">
                          {result.data.reason}
                        </Box>
                      </FormField>
                    </Box>
                  )}

                  {result.data.content?.rules && (
                    <Box margin={{ top: "m" }}>
                      <FormField label="Rules">
                        <Box variant="code">
                          {JSON.stringify(result.data.content.rules, null, 2)}
                        </Box>
                      </FormField>
                    </Box>
                  )}
                </Box>
              )}
            </SpaceBetween>
          ) : (
            <Box textAlign="center" color="text-body-secondary">
              <em>
                Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.
              </em>
            </Box>
          )}
        </Container>
      </SpaceBetween>
    </ExpandableSection>
  );
}
