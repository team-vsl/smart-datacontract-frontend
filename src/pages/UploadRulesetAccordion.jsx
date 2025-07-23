import { useState } from "react";

export function UploadRulesetAccordion({ rulesets, setRulesets }) {
  // Form state
  const [rulesetName, setRulesetName] = useState("");
  const [rulesetContent, setRulesetContent] = useState("");

  // Upload status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Form validation
  const [errors, setErrors] = useState({});
  
  // State cho accordion
  const [isOpen, setIsOpen] = useState(false);

  const validateForm = () => {
    const newErrors = {};

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
          const allRulesValid = parsedContent.rules.every(rule => 
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
      
      // Lưu trạng thái hợp lệ để sử dụng trong handleSubmit
      window.isRulesetValid = isValidFormat && isValidStructure;
    }

    setErrors(newErrors);
    // Trả về true để form luôn được submit, kể cả khi có lỗi
    // Chúng ta sẽ xử lý lỗi trong handleSubmit
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    const newErrors = {};

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
          const allRulesValid = parsedContent.rules.every(rule => 
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
      
      // Lưu trạng thái hợp lệ để sử dụng trong handleSubmit
      window.isRulesetValid = isValidFormat && isValidStructure;
    }

    setErrors(newErrors);
    
    // Nếu có lỗi trong form, vẫn tiếp tục nhưng đặt ruleset vào trạng thái rejected
    const hasErrors = Object.keys(newErrors).length > 0;

    setIsSubmitting(true);
    setUploadResult(null);

    try {
      // Luôn tạo ruleset mới, nếu có lỗi thì đặt trạng thái rejected
      const newRulesetId = `rs-${Math.floor(Math.random() * 1000)}`;
      
      // Nếu tên ruleset trống, tạo ruleset với trạng thái rejected
      if (!rulesetName.trim()) {
        const newRuleset = {
          id: newRulesetId,
          name: "Ruleset không tên",
          state: "rejected",
          createdAt: new Date().toISOString().split('T')[0],
          reason: "Tên ruleset không được để trống",
          content: { raw: rulesetContent || "Không có nội dung" }
        };
        
        setRulesets(prevRulesets => [...prevRulesets, newRuleset]);
        
        setUploadResult({
          success: false,
          message: "Upload ruleset thất bại do tên ruleset trống. Ruleset đã được đặt vào trạng thái 'Đã từ chối'.",
          data: newRuleset
        });
        
        setIsSubmitting(false);
        return;
      }
      
      // Nếu nội dung ruleset trống, tạo ruleset với trạng thái rejected
      if (!rulesetContent.trim()) {
        const newRuleset = {
          id: newRulesetId,
          name: rulesetName,
          state: "rejected",
          createdAt: new Date().toISOString().split('T')[0],
          reason: "Nội dung ruleset không được để trống",
          content: { raw: "Không có nội dung" }
        };
        
        setRulesets(prevRulesets => [...prevRulesets, newRuleset]);
        
        setUploadResult({
          success: false,
          message: "Upload ruleset thất bại do nội dung ruleset trống. Ruleset đã được đặt vào trạng thái 'Đã từ chối'.",
          data: newRuleset
        });
        
        setIsSubmitting(false);
        return;
      }
      
      // Giả lập API call với delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lấy kết quả validation từ biến toàn cục hoặc kiểm tra lỗi form
      // Bỏ qua kiểm tra lỗi form vì chúng ta muốn luôn tạo ruleset
      const isValid = (window.isRulesetValid || false);
      
      if (isValid) {
        // Nếu ruleset hợp lệ, trạng thái là "active"
        const state = "active";
        const message = "Ruleset đã được upload thành công và được kích hoạt!";
        
        // Nếu ruleset hợp lệ
        const newRuleset = {
          id: newRulesetId,
          name: rulesetName,
          state: state,
          createdAt: new Date().toISOString().split('T')[0],
          content: JSON.parse(rulesetContent)
        };
        
        // Thêm ruleset mới vào danh sách
        console.log("Thêm ruleset hợp lệ:", newRuleset);
        console.log("Danh sách rulesets trước khi thêm:", rulesets);
        // Sử dụng cách cập nhật state đảm bảo React nhận biết thay đổi
        setRulesets(prevRulesets => {
          const newRulesets = [...prevRulesets, newRuleset];
          console.log("Danh sách rulesets sau khi thêm:", newRulesets);
          return newRulesets;
        });
        
        setUploadResult({
          success: true,
          message: message,
          data: newRuleset
        });
      } else {
        // Nếu ruleset không hợp lệ, trạng thái là "rejected"
        const newRuleset = {
          id: newRulesetId,
          name: rulesetName,
          state: "rejected",
          createdAt: new Date().toISOString().split('T')[0],
          reason: errors.content || "Cú pháp ruleset không hợp lệ",
          content: { raw: rulesetContent }
        };
        
        // Thêm ruleset mới vào danh sách
        console.log("Thêm ruleset không hợp lệ:", newRuleset);
        console.log("Danh sách rulesets trước khi thêm:", rulesets);
        // Sử dụng cách cập nhật state đảm bảo React nhận biết thay đổi
        setRulesets(prevRulesets => {
          const newRulesets = [...prevRulesets, newRuleset];
          console.log("Danh sách rulesets sau khi thêm:", newRulesets);
          console.log("Kiểm tra ruleset rejected:", newRulesets.filter(r => r.state === "rejected"));
          return newRulesets;
        });
        
        setUploadResult({
          success: false,
          message: "Upload ruleset thất bại do cú pháp không hợp lệ. Ruleset đã được đặt vào trạng thái 'Đã từ chối'.",
          data: newRuleset
        });
        
        // Không cần tự động chọn trạng thái "archived" ở đây
        // Người dùng sẽ chọn trạng thái "archived" trong dropdown để xem ruleset không hợp lệ
      }

      // Clear form sau khi upload
      setRulesetName("");
      setRulesetContent("");
      
      // Xóa biến toàn cục
      delete window.isRulesetValid;
      
    } catch (error) {
      console.error("Lỗi khi upload ruleset:", error);
      
      // Tạo ruleset với trạng thái rejected khi có lỗi
      const newRulesetId = `rs-${Math.floor(Math.random() * 1000)}`;
      const newRuleset = {
        id: newRulesetId,
        name: rulesetName || "Ruleset lỗi",
        state: "rejected",
        createdAt: new Date().toISOString().split('T')[0],
        reason: "Lỗi khi xử lý upload",
        content: { raw: rulesetContent || "Không có nội dung" }
      };
      
      setRulesets(prevRulesets => [...prevRulesets, newRuleset]);
      
      setUploadResult({
        success: false,
        message: "Upload ruleset thất bại. Ruleset đã được đặt vào trạng thái 'Đã từ chối'.",
        data: newRuleset
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border rounded-md mb-4">
        {/* Accordion Header */}
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg font-medium">Upload Ruleset</h2>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
        
        {/* Accordion Content */}
        {isOpen && (
          <div className="p-4 border-t">
            <div className="space-y-6">
              {/* Phần tương tác - Form */}
              <div className="mb-4 p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-3">Upload Ruleset Mới</h3>

                <form onSubmit={handleSubmit}>
                  {/* Ruleset Name Input */}
                  <div className="mb-3">
                    <label htmlFor="ruleset-name" className="block text-sm font-medium mb-1">
                      Tên Ruleset
                    </label>
                    <input
                      id="ruleset-name"
                      type="text"
                      value={rulesetName}
                      onChange={(e) => {
                        setRulesetName(e.target.value);
                        // Xóa lỗi khi người dùng nhập
                        if (errors.name) {
                          setErrors({...errors, name: null});
                        }
                      }}
                      className={`w-full p-2 border rounded-md ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập tên ruleset"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Ruleset Content Textarea */}
                  <div className="mb-3">
                    <label htmlFor="ruleset-content" className="block text-sm font-medium mb-1">
                      Nội dung Ruleset
                    </label>
                    <textarea
                      id="ruleset-content"
                      value={rulesetContent}
                      onChange={(e) => {
                        setRulesetContent(e.target.value);
                        // Xóa lỗi khi người dùng nhập
                        if (errors.content) {
                          setErrors({...errors, content: null});
                        }
                      }}
                      className={`w-full p-2 border rounded-md h-40 ${
                        errors.content ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập nội dung ruleset (phải là định dạng JSON hoặc YAML hợp lệ)"
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Ví dụ JSON hợp lệ: {"{"}"rules": [{"{"}"id": "rule1", "name": "Check null", "condition": "value != null"{"}"}]{"}"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Ví dụ YAML hợp lệ: rules:<br/>- id: rule1<br/>  name: Check null<br/>  condition: value != null
                    </p>
                    <p className="mt-1 text-xs text-gray-500 font-semibold">
                      Lưu ý: Nội dung ruleset phải có trường "rules" là một mảng, và mỗi rule phải có các trường: id, name, condition.
                      Ruleset hợp lệ sẽ được đặt trạng thái "active", không hợp lệ sẽ được đặt trạng thái "rejected".
                    </p>
                  </div>



                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang upload..." : "Upload Ruleset"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Phần kết quả */}
              {uploadResult && (
                <div className={`p-4 border rounded-md ${
                  uploadResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex items-center">
                    {uploadResult.success ? (
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p className={uploadResult.success ? "text-green-700" : "text-red-700"}>
                      {uploadResult.message}
                    </p>
                  </div>
                  
                  {uploadResult.data && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Thông tin Ruleset</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">ID</p>
                          <p>{uploadResult.data.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tên</p>
                          <p>{uploadResult.data.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Trạng thái</p>
                          <p>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              uploadResult.data.state === 'active' ? 'bg-green-100 text-green-800' :
                              uploadResult.data.state === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              uploadResult.data.state === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {uploadResult.data.state}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày tạo</p>
                          <p>{uploadResult.data.createdAt}</p>
                        </div>
                        {!uploadResult.success && uploadResult.data.reason && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Lý do từ chối</p>
                            <p>{uploadResult.data.reason}</p>
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        {uploadResult.data.state === "active" ? (
                          <>Ruleset đã được tạo với trạng thái <strong>active</strong> (hoạt động).</>
                        ) : uploadResult.data.state === "rejected" ? (
                          <>Ruleset đã bị từ chối với trạng thái <strong>rejected</strong> do cú pháp không hợp lệ.</>
                        ) : (
                          <>Ruleset đã được tạo với trạng thái <strong>{uploadResult.data.state}</strong>.</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}