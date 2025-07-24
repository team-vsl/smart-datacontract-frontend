import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RulesetAPI } from "../../../objects/api";
import type { Ruleset } from "../../../objects/api";
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
  Textarea
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

interface UploadRulesetProps {
  rulesets: Ruleset[];
  setRulesets: React.Dispatch<React.SetStateAction<Ruleset[]>>;
}

interface FormErrors {
  name?: string | null;
  content?: string | null;
  [key: string]: string | null | undefined;
}

interface UploadResult {
  success: boolean;
  message: string;
  data: Ruleset;
}

// Hàm tìm ID của ruleset có cùng tên trong trạng thái pending
function findExistingRulesetId(rulesets: Ruleset[], name: string, defaultId: string): string {
  if (!name || !name.trim()) return defaultId;
  
  const existingRuleset = rulesets.find(r => 
    r.name.toLowerCase().trim() === name.toLowerCase().trim() && 
    r.state === "pending"
  );
  
  console.log("Tìm thấy ruleset có cùng tên trong trạng thái pending:", existingRuleset);
  
  return existingRuleset ? existingRuleset.id : defaultId;
}

export function UploadRuleset({ rulesets, setRulesets }: UploadRulesetProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();
  
  // Form state
  const [rulesetName, setRulesetName] = useState<string>("");
  const [rulesetContent, setRulesetContent] = useState<string>("");

  // Upload status
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  // Form validation
  const [errors, setErrors] = useState<FormErrors>({});
  
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Sử dụng useMutation để upload ruleset
  const uploadMutation = useMutation({
    mutationFn: async (newRuleset: Ruleset) => {
      // Giả lập API call với delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sử dụng RulesetAPI để thêm ruleset mới
      const updatedRulesets = await RulesetAPI.addRuleset(newRuleset);
      setRulesets(updatedRulesets);
      return newRuleset;
    },
    onSuccess: (data) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['rulesets'] });
      queryClient.invalidateQueries({ queryKey: ['allRulesets'] });
      
      // Hiển thị kết quả
      setUploadResult({
        success: data.state === "active",
        message: data.state === "active" 
          ? "Ruleset đã được upload thành công và được kích hoạt!" 
          : "Upload ruleset thất bại do cú pháp không hợp lệ.",
        data: data
      });
      
      // Clear form sau khi upload thành công
      if (data.state === "active") {
        setRulesetName("");
        setRulesetContent("");
      }
    },
    onError: (error) => {
      console.error("Lỗi khi upload ruleset:", error);
      setUploadResult({
        success: false,
        message: "Upload ruleset thất bại.",
        data: {
          id: `rs-${Math.floor(Math.random() * 1000)}`,
          name: rulesetName || "Ruleset lỗi",
          state: "rejected",
          createdAt: new Date().toISOString().split('T')[0],
          reason: "Lỗi khi xử lý upload",
          content: { raw: rulesetContent || "Không có nội dung" }
        }
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const newErrors: FormErrors = {};

    if (!rulesetName.trim()) {
      newErrors.name = "Tên ruleset không được để trống";
    }

    if (!rulesetContent.trim()) {
      newErrors.content = "Nội dung ruleset không được để trống";
    } else {
      // Kiểm tra định dạng JSON
      let isValidFormat = false;
      let isValidStructure = false;
      
      // Thử kiểm tra JSON
      try {
        const parsedContent = JSON.parse(rulesetContent);
        isValidFormat = true; // Nếu parse thành công, đây là JSON hợp lệ
        
        // Kiểm tra cấu trúc của ruleset
        if (parsedContent.rules && Array.isArray(parsedContent.rules)) {
          // Kiểm tra xem mỗi rule có đủ các trường cần thiết không
          const allRulesValid = parsedContent.rules.every((rule: any) => 
            rule.id && rule.name && rule.condition
          );
          
          if (allRulesValid) {
            isValidStructure = true;
          } else {
            newErrors.content = "Mỗi rule phải có các trường: id, name, condition";
          }
        } else {
          newErrors.content = "Ruleset phải có trường 'rules' là một mảng";
        }
      } catch (jsonError) {
        // Không phải JSON, kiểm tra YAML đơn giản
        // Đây chỉ là kiểm tra cơ bản, không chính xác 100%
        
        // Một số đặc điểm cơ bản của YAML:
        // - Có dòng với định dạng key: value
        // - Hoặc có dòng bắt đầu bằng dấu gạch ngang (-)
        const hasKeyValuePair = /^\s*[\w\-]+\s*:\s*.+/m.test(rulesetContent);
        const hasListItem = /^\s*-\s+.+/m.test(rulesetContent);
        const hasRulesSection = /^\s*rules\s*:/m.test(rulesetContent);
        
        if ((hasKeyValuePair || hasListItem) && hasRulesSection) {
          isValidFormat = true;
          isValidStructure = true; // Giả định YAML có cấu trúc đúng
        } else {
          newErrors.content = "Nội dung phải là định dạng JSON hoặc YAML hợp lệ và có trường 'rules'";
        }
      }
      
      if (!isValidFormat) {
        newErrors.content = "Nội dung phải là định dạng JSON hoặc YAML hợp lệ";
      } else if (!isValidStructure) {
        // Nếu đã có lỗi cụ thể về cấu trúc, giữ nguyên lỗi đó
        if (!newErrors.content) {
          newErrors.content = "Cấu trúc ruleset không hợp lệ";
        }
      }
    }

    setErrors(newErrors);
    setUploadResult(null);
    
    // Nếu có lỗi trong form, vẫn tiếp tục nhưng đặt ruleset vào trạng thái rejected
    const hasErrors = Object.keys(newErrors).length > 0;
    const randomId = `rs-${Math.floor(Math.random() * 1000)}`;

    // Nếu tên ruleset trống, tạo ruleset với trạng thái rejected
    if (!rulesetName.trim()) {
      // Không cần tìm ruleset có sẵn vì tên trống
      const newRuleset: Ruleset = {
        id: randomId,
        name: "Ruleset không tên",
        state: "rejected",
        createdAt: new Date().toISOString().split('T')[0],
        reason: "Tên ruleset không được để trống",
        content: { raw: rulesetContent || "Không có nội dung" }
      };
      
      // Sử dụng mutation để upload ruleset
      uploadMutation.mutate(newRuleset);
      return;
    }
    
    // Nếu nội dung ruleset trống, tạo ruleset với trạng thái rejected
    if (!rulesetContent.trim()) {
      // Tìm ID của ruleset có cùng tên trong trạng thái pending
      const rulesetId = findExistingRulesetId(rulesets, rulesetName, randomId);
      
      const newRuleset: Ruleset = {
        id: rulesetId,
        name: rulesetName,
        state: "rejected",
        createdAt: new Date().toISOString().split('T')[0],
        reason: "Nội dung ruleset không được để trống",
        content: { raw: "Không có nội dung" }
      };
      
      // Sử dụng mutation để upload ruleset
      uploadMutation.mutate(newRuleset);
      return;
    }
    
    try {
      // Kiểm tra nội dung có hợp lệ không
      const isValid = !hasErrors;
      
      if (isValid) {
        // Tìm ID của ruleset có cùng tên trong trạng thái pending
        const rulesetId = findExistingRulesetId(rulesets, rulesetName, randomId);
        
        // Nếu ruleset hợp lệ, trạng thái là "active"
        const newRuleset: Ruleset = {
          id: rulesetId,
          name: rulesetName,
          state: "active",
          createdAt: new Date().toISOString().split('T')[0],
          content: JSON.parse(rulesetContent)
        };
        
        // Sử dụng mutation để upload ruleset
        uploadMutation.mutate(newRuleset);
      } else {
        // Tìm ID của ruleset có cùng tên trong trạng thái pending
        const rulesetId = findExistingRulesetId(rulesets, rulesetName, randomId);
        
        // Nếu ruleset không hợp lệ, trạng thái là "rejected"
        const newRuleset: Ruleset = {
          id: rulesetId,
          name: rulesetName,
          state: "rejected",
          createdAt: new Date().toISOString().split('T')[0],
          reason: errors.content || "Cú pháp ruleset không hợp lệ",
          content: { raw: rulesetContent }
        };
        
        // Sử dụng mutation để upload ruleset
        uploadMutation.mutate(newRuleset);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      
      // Tạo ruleset với trạng thái rejected khi có lỗi
      const rulesetId = findExistingRulesetId(rulesets, rulesetName, randomId);
      
      const newRuleset: Ruleset = {
        id: rulesetId,
        name: rulesetName || "Ruleset lỗi",
        state: "rejected",
        createdAt: new Date().toISOString().split('T')[0],
        reason: "Lỗi khi xử lý upload",
        content: { raw: rulesetContent || "Không có nội dung" }
      };
      
      // Sử dụng mutation để upload ruleset
      uploadMutation.mutate(newRuleset);
    }
  };

  return (
    <ExpandableSection
      headerText="Upload Ruleset"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
        <SpaceBetween size="l">
          {/* Phần tương tác - Form */}
          <Container>
            <Header variant="h3">Upload Ruleset Mới</Header>
            
            <form onSubmit={handleSubmit}>
              <SpaceBetween size="m" direction="vertical">
                {/* Ruleset Name Input */}
                <FormField
                  label="Tên Ruleset"
                  errorText={errors.name}
                >
                  <Input
                    value={rulesetName}
                    onChange={({ detail }) => {
                      setRulesetName(detail.value);
                      // Xóa lỗi khi người dùng nhập
                      if (errors.name) {
                        setErrors({...errors, name: null});
                      }
                    }}
                    placeholder="Nhập tên ruleset"
                  />
                </FormField>

                {/* Ruleset Content Textarea */}
                <FormField
                  label="Nội dung Ruleset"
                  errorText={errors.content}
                  description={
                    <SpaceBetween size="xs">
                      <Box variant="p">
                        Ví dụ JSON hợp lệ: {'{"rules": [{"id": "rule1", "name": "Check null", "condition": "value != null"}]}'}
                      </Box>
                      <Box variant="p">
                        Ví dụ YAML hợp lệ: rules:<br/>- id: rule1<br/>  name: Check null<br/>  condition: value != null
                      </Box>
                      <Box variant="p" fontWeight="bold">
                        Lưu ý: Nội dung ruleset phải có trường "rules" là một mảng, và mỗi rule phải có các trường: id, name, condition.
                      </Box>
                    </SpaceBetween>
                  }
                >
                  <Textarea
                    value={rulesetContent}
                    onChange={({ detail }) => {
                      setRulesetContent(detail.value);
                      // Xóa lỗi khi người dùng nhập
                      if (errors.content) {
                        setErrors({...errors, content: null});
                      }
                    }}
                    placeholder="Nhập nội dung ruleset (phải là định dạng JSON hoặc YAML hợp lệ)"
                    rows={10}
                  />
                </FormField>

                {/* Submit Button */}
                <Button
                  formAction="submit"
                  variant="primary"
                  disabled={uploadMutation.isPending}
                  loading={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Đang upload..." : "Upload Ruleset"}
                </Button>
              </SpaceBetween>
            </form>
          </Container>

          {/* Phần kết quả */}
          {uploadResult && (
            <Container
              header={<Header variant="h3">Kết quả Upload</Header>}
            >
              <StatusIndicator type={uploadResult.success ? "success" : "error"}>
                {uploadResult.message}
              </StatusIndicator>
              
              {uploadResult.data && (
                <Box margin={{top: "m"}}>
                  <Header variant="h3">Thông tin Ruleset</Header>
                  <ColumnLayout columns={2} variant="text-grid">
                    <FormField label="ID">{uploadResult.data.id}</FormField>
                    <FormField label="Tên">{uploadResult.data.name}</FormField>
                    <FormField label="Trạng thái">
                      <StatusIndicator type={
                        uploadResult.data.state === 'active' ? "success" :
                        uploadResult.data.state === 'pending' ? "in-progress" :
                        uploadResult.data.state === 'rejected' ? "error" : "stopped"
                      }>
                        {uploadResult.data.state}
                      </StatusIndicator>
                    </FormField>
                    <FormField label="Ngày tạo">{uploadResult.data.createdAt}</FormField>
                    {!uploadResult.success && uploadResult.data.reason && (
                      <Box margin={{top: "m"}}>
                        <FormField label="Lý do từ chối">
                          <Box color="text-status-error">{uploadResult.data.reason}</Box>
                        </FormField>
                      </Box>
                    )}
                  </ColumnLayout>
                  
                  <Box margin={{top: "m"}}>
                    {uploadResult.data.state === "active" ? (
                      <Box>Ruleset đã được tạo với trạng thái <Box variant="span" fontWeight="bold">active</Box> (hoạt động).</Box>
                    ) : uploadResult.data.state === "rejected" ? (
                      <Box>Ruleset đã bị từ chối với trạng thái <Box variant="span" fontWeight="bold">rejected</Box> do cú pháp không hợp lệ.</Box>
                    ) : (
                      <Box>Ruleset đã được tạo với trạng thái <Box variant="span" fontWeight="bold">{uploadResult.data.state}</Box>.</Box>
                    )}
                  </Box>
                </Box>
              )}
            </Container>
          )}
        </SpaceBetween>
    </ExpandableSection>
  );
}