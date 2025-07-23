import { useState, useEffect } from "react";
import { getRulesetsByState } from "../states/ruleset-state";

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
  // State cho loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // State cho danh sách đã lọc
  const [filteredRulesets, setFilteredRulesets] = useState<Ruleset[]>([]);

  // Cập nhật filteredRulesets khi rulesetState hoặc rulesets thay đổi
  useEffect(() => {
    if (rulesetState) {
      setIsLoading(true);
      try {
        // Lọc ruleset theo trạng thái
        console.log("Danh sách rulesets hiện tại:", rulesets);
        console.log("Đang lọc theo trạng thái:", rulesetState);
        const filtered = getRulesetsByState(rulesets, rulesetState);
        console.log("Kết quả lọc:", filtered);
        setFilteredRulesets(filtered);
        setIsError(false);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [rulesetState, rulesets]);

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

  return (
    <div className="w-full">
      <div className="border rounded-md mb-4">
        {/* Accordion Header */}
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg font-medium">Get/List Rulesets</h2>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
        
        {/* Accordion Content */}
        {isOpen && (
          <div className="p-4 border-t">
            <div className="space-y-6">
              {/* Phần tương tác */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                {/* List Rulesets - Dropdown chọn state */}
                <div className="space-y-2">
                  <h3 className="font-medium">List Rulesets</h3>
                  <select 
                    className="w-full p-2 border rounded-md" 
                    onChange={(e) => handleStateChange(e.target.value)}
                    value={rulesetState}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="pending">Đang chờ xử lý</option>
                    <option value="rejected">Đã từ chối</option>
                  </select>
                </div>

                {/* Get Ruleset - Input ID/Name và nút Submit */}
                <div className="space-y-2">
                  <h3 className="font-medium">Get Ruleset</h3>
                  <div className="flex space-x-2">
                    <input
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Nhập ID hoặc tên Ruleset"
                      value={rulesetId}
                      onChange={(e) => setRulesetId(e.target.value)}
                    />
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={handleGetRuleset}
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              {/* Phần kết quả (view) */}
              <div className="space-y-4">
                {/* Hiển thị loading state */}
                {isLoading && (
                  <div className="text-center py-4">
                    <p>Đang tải dữ liệu...</p>
                  </div>
                )}
                
                {/* Hiển thị lỗi */}
                {isError && (
                  <div className="text-center py-4 text-red-500">
                    <p>Có lỗi xảy ra: {error?.message || 'Không thể tải dữ liệu'}</p>
                  </div>
                )}

                {/* Hiển thị danh sách ruleset */}
                {!isLoading && !isError && filteredRulesets.length > 0 && rulesetState && !selectedRuleset && (
                  <div>
                    <h3 className="font-medium mb-2">Danh sách Ruleset - Trạng thái: {rulesetState}</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRulesets.map((ruleset) => (
                            <tr key={ruleset.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRuleset(ruleset)}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{ruleset.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{ruleset.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{ruleset.version || "1.0.0"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  ruleset.state === 'active' ? 'bg-green-100 text-green-800' :
                                  ruleset.state === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  ruleset.state === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {ruleset.state}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Hiển thị thông báo khi không có ruleset */}
                {!isLoading && !isError && filteredRulesets.length === 0 && rulesetState && !selectedRuleset && (
                  <div className="text-center py-4">
                    {rulesetState === 'active' && (
                      <p>Không có ruleset nào ở trạng thái active.</p>
                    )}
                    {rulesetState === 'rejected' && (
                      <p>Không có ruleset nào ở trạng thái rejected.</p>
                    )}
                    {rulesetState === 'pending' && (
                      <p>Không có ruleset nào ở trạng thái pending.</p>
                    )}
                  </div>
                )}

                {/* Hiển thị chi tiết ruleset */}
                {selectedRuleset && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Chi tiết Ruleset</h3>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => setSelectedRuleset(null)}
                      >
                        Quay lại danh sách
                      </button>
                    </div>
                    <div className="border rounded-md p-4 bg-white">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">ID</p>
                          <p>{selectedRuleset.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tên</p>
                          <p>{selectedRuleset.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Version</p>
                          <p>{selectedRuleset.version || "1.0.0"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Trạng thái</p>
                          <p>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              selectedRuleset.state === 'active' ? 'bg-green-100 text-green-800' :
                              selectedRuleset.state === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              selectedRuleset.state === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedRuleset.state}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày tạo</p>
                          <p>{selectedRuleset.createdAt}</p>
                        </div>
                        {selectedRuleset.reason && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Lý do từ chối</p>
                            <p className="text-red-600">{selectedRuleset.reason}</p>
                          </div>
                        )}
                      </div>

                      {selectedRuleset.description && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Mô tả</p>
                          <p>{selectedRuleset.description}</p>
                        </div>
                      )}

                      {selectedRuleset.content && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Nội dung</p>
                          {selectedRuleset.content.rules ? (
                            <div className="mt-2 border rounded-md overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rule ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedRuleset.content.rules.map((rule) => (
                                    <tr key={rule.id}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">{rule.id}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">{rule.name}</td>
                                      <td className="px-4 py-2 text-sm font-mono">{rule.condition}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : selectedRuleset.content.raw ? (
                            <div className="mt-2">
                              <p className="text-sm text-red-500 mb-2">Nội dung không hợp lệ:</p>
                              <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-auto mt-1 border border-red-200">
                                {selectedRuleset.content.raw}
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}