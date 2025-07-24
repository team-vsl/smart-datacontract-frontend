import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRulesetsByState } from "../states/ruleset-state";
import {
  Button,
  Container,
  Header,
  Select,
  Input,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
  ColumnLayout,
  Table,
  TextFilter
} from "@cloudscape-design/components";

// Define interfaces for ruleset data
interface Rule {
  id: string;
  name: string;
  condition: string;
}

interface RulesetContent {
  rules?: Rule[];
  raw?: string;
}

interface Ruleset {
  id: string;
  name: string;
  version?: string;
  state: "active" | "pending" | "rejected";
  createdAt: string;
  description?: string;
  reason?: string;
  content: RulesetContent;
  validationStatus?: string;
}

interface RulesetsAccordionProps {
  rulesets: Ruleset[];
}

export function RulesetsAccordion({ rulesets }: RulesetsAccordionProps) {
  // State cho ruleset chi tiết
  const [selectedRuleset, setSelectedRuleset] = useState<Ruleset | null>(null);
  // State cho các input
  const [rulesetState, setRulesetState] = useState<string>("");
  const [rulesetId, setRulesetId] = useState<string>("");
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sử dụng useQuery để lọc ruleset theo trạng thái
  const {
    data: filteredRulesets = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['rulesets', rulesetState, rulesets],
    queryFn: () => {
      if (!rulesetState) return [];
      console.log("Danh sách rulesets hiện tại:", rulesets);
      console.log("Đang lọc theo trạng thái:", rulesetState);
      const filtered = getRulesetsByState(rulesets, rulesetState);
      console.log("Kết quả lọc:", filtered);
      return filtered;
    },
    enabled: !!rulesetState, // Chỉ gọi khi có rulesetState
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = (value: string) => {
    setRulesetState(value);
  };

  // Hàm xử lý khi submit ID/tên ruleset
  const handleGetRuleset = () => {
    if (!rulesetId) return;
    setIsLoading(true);

    // Tìm ruleset theo ID hoặc tên
    const foundRuleset = rulesets.find(
      ruleset => ruleset.id === rulesetId || ruleset.name === rulesetId
    );

    if (foundRuleset) {
      setSelectedRuleset(foundRuleset);
    } else {
      setIsError(true);
      setError(new Error(`Không tìm thấy ruleset với ID hoặc tên: ${rulesetId}`));
    }

    setIsLoading(false);
  };

  // Chuyển đổi danh sách trạng thái cho Select component
  const stateOptions = [
    { label: "Chọn trạng thái", value: "" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Đang chờ xử lý", value: "pending" },
    { label: "Đã từ chối", value: "rejected" }
  ];

  return (
    <ExpandableSection
      headerText="Get/List Rulesets"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={2}>
          {/* List Rulesets - Dropdown chọn state */}
          <Container header={<Header variant="h3">List Rulesets</Header>}>
            <FormField label="Trạng thái">
              <Select
                selectedOption={stateOptions.find(option => option.value === rulesetState) || null}
                onChange={({ detail }) => detail.selectedOption && handleStateChange(detail.selectedOption.value as string)}
                options={stateOptions}
                placeholder="Chọn trạng thái"
              />
            </FormField>
          </Container>

          {/* Get Ruleset - Input ID/Name và nút Submit */}
          <Container header={<Header variant="h3">Get Ruleset</Header>}>
            <SpaceBetween size="xs" direction="horizontal">
              <Input
                value={rulesetId}
                onChange={({ detail }) => setRulesetId(detail.value)}
                placeholder="Nhập ID hoặc tên Ruleset"
              />
              <Button
                onClick={handleGetRuleset}
                variant="primary"
              >
                Tìm kiếm
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        {/* Hiển thị loading state */}
        {isLoading && (
          <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
        )}

        {/* Hiển thị lỗi */}
        {isError && (
          <Box padding="m" variant="error">
            <StatusIndicator type="error">{error?.message || 'Không thể tải dữ liệu'}</StatusIndicator>
          </Box>
        )}

        {/* Hiển thị danh sách ruleset */}
        {!isLoading && !isError && filteredRulesets.length > 0 && rulesetState && !selectedRuleset && (
          <Container header={<Header variant="h3">Danh sách Ruleset - Trạng thái: {rulesetState}</Header>}>
            <Table
              columnDefinitions={[
                {
                  id: "id",
                  header: "ID",
                  cell: item => item.id,
                  sortingField: "id"
                },
                {
                  id: "name",
                  header: "Tên",
                  cell: item => item.name,
                  sortingField: "name"
                },
                {
                  id: "version",
                  header: "Version",
                  cell: item => item.version || "1.0.0",
                  sortingField: "version"
                },
                {
                  id: "state",
                  header: "Trạng thái",
                  cell: item => (
                    <StatusIndicator type={
                      item.state === 'active' ? "success" :
                        item.state === 'pending' ? "in-progress" :
                          item.state === 'rejected' ? "error" : "stopped"
                    }>
                      {item.state}
                    </StatusIndicator>
                  )
                }
              ]}
              items={filteredRulesets}
              onSelectionChange={({ detail }) => {
                if (detail.selectedItems.length > 0) {
                  setSelectedRuleset(detail.selectedItems[0]);
                }
              }}
              selectionType="single"
              trackBy="id"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>Không có dữ liệu</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    Không tìm thấy ruleset nào với trạng thái đã chọn.
                  </Box>
                </Box>
              }
            />
          </Container>
        )}

        {/* Hiển thị thông báo khi không có ruleset */}
        {!isLoading && !isError && filteredRulesets.length === 0 && rulesetState && !selectedRuleset && (
          <Box textAlign="center" color="text-body-secondary">
            {rulesetState === 'active' && (
              <p>Không có ruleset nào ở trạng thái active.</p>
            )}
            {rulesetState === 'rejected' && (
              <p>Không có ruleset nào ở trạng thái rejected.</p>
            )}
            {rulesetState === 'pending' && (
              <p>Không có ruleset nào ở trạng thái pending.</p>
            )}
          </Box>
        )}

        {/* Hiển thị chi tiết ruleset */}
        {selectedRuleset && (
          <Container
            header={
              <Header
                variant="h3"
                actions={
                  <Button
                    onClick={() => setSelectedRuleset(null)}
                    variant="primary"
                  >
                    Quay lại danh sách
                  </Button>
                }
              >
                Chi tiết Ruleset
              </Header>
            }
          >
            <ColumnLayout columns={2} variant="text-grid">
              <FormField label="ID">{selectedRuleset.id}</FormField>
              <FormField label="Tên">{selectedRuleset.name}</FormField>
              <FormField label="Version">{selectedRuleset.version || "1.0.0"}</FormField>
              <FormField label="Trạng thái">
                <StatusIndicator type={
                  selectedRuleset.state === 'active' ? "success" :
                    selectedRuleset.state === 'pending' ? "in-progress" :
                      selectedRuleset.state === 'rejected' ? "error" : "stopped"
                }>
                  {selectedRuleset.state}
                </StatusIndicator>
              </FormField>
              <FormField label="Ngày tạo">{selectedRuleset.createdAt}</FormField>
              {selectedRuleset.reason && (
                <FormField label="Lý do từ chối">
                  <Box color="text-status-error">{selectedRuleset.reason}</Box>
                </FormField>
              )}
            </ColumnLayout>

            {selectedRuleset.description && (
              <Box margin={{ top: "l" }}>
                <FormField label="Mô tả">{selectedRuleset.description}</FormField>
              </Box>
            )}

            {selectedRuleset.content && (
              <Box margin={{ top: "l" }}>
                <Header variant="h4">Nội dung</Header>
                {selectedRuleset.content.rules ? (
                  <Table
                    columnDefinitions={[
                      {
                        id: "id",
                        header: "Rule ID",
                        cell: item => item.id
                      },
                      {
                        id: "name",
                        header: "Name",
                        cell: item => item.name
                      },
                      {
                        id: "condition",
                        header: "Condition",
                        cell: item => item.condition
                      }
                    ]}
                    items={selectedRuleset.content.rules}
                    trackBy="id"
                  />
                ) : selectedRuleset.content.raw ? (
                  <Box>
                    <Box color="text-status-error" margin={{ bottom: "s" }}>Nội dung không hợp lệ:</Box>
                    <Box variant="code">
                      {selectedRuleset.content.raw}
                    </Box>
                  </Box>
                ) : null}
              </Box>
            )}
          </Container>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}