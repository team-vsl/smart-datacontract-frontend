import { useState } from "react";

export function CheckRulesetAccordion({ rulesets, setRulesets }) {
  // State cho input và kết quả
  const [rulesetId, setRulesetId] = useState("");
  const [result, setResult] = useState(null);
  // State cho accordion
  const [isOpen, setIsOpen] = useState(true);
  // State cho loading
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi approve ruleset
  const handleApprove = () => {
    if (!rulesetId) return;
    
    setIsLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      // Dữ liệu mẫu
      const updatedRuleset = {
        id: rulesetId,
        name: "Sample Ruleset",
        version: "1.0.0",
        state: "active",
        owner: "Data Engineer",
        description: "This is an approved ruleset",
        content: {
          rules: [
            { id: "rule1", name: "Check null values", condition: "value != null" },
            { id: "rule2", name: "Check data type", condition: "typeof value === 'string'" }
          ]
        },
        approvedAt: new Date().toISOString(),
        approvedBy: "Data Engineer",
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setResult({
        status: "approved",
        message: `Ruleset ${rulesetId} đã được chấp thuận`,
        data: {
          ...updatedRuleset,
          status: "approved"
        }
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // Hàm xử lý khi reject ruleset
  const handleReject = () => {
    if (!rulesetId) return;
    
    setIsLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      // Dữ liệu mẫu
      const updatedRuleset = {
        id: rulesetId,
        name: "Sample Ruleset",
        version: "1.0.0",
        state: "archived",
        owner: "Data Engineer",
        description: "This ruleset was rejected",
        content: {
          rules: [
            { id: "rule1", name: "Check null values", condition: "value != null" },
            { id: "rule2", name: "Check data type", condition: "typeof value === 'string'" }
          ]
        },
        rejectedAt: new Date().toISOString(),
        rejectedBy: "Data Engineer",
        reason: "Ruleset không đáp ứng yêu cầu",
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setResult({
        status: "rejected",
        message: `Ruleset ${rulesetId} đã bị từ chối`,
        data: {
          ...updatedRuleset,
          status: "rejected"
        }
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="border rounded-md mb-4">
        {/* Accordion Header */}
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg font-medium">Check Ruleset</h2>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
        
        {/* Accordion Content */}
        {isOpen && (
          <div className="p-4 border-t">
            <div className="space-y-6">
              {/* Phần tương tác */}
              <div className="space-y-4">
                <h3 className="font-medium">Tương tác</h3>
                <div className="flex items-center space-x-2">
                  <input
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Nhập Ruleset ID hoặc Name"
                    value={rulesetId}
                    onChange={(e) => setRulesetId(e.target.value)}
                  />
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleApprove}
                    disabled={!rulesetId || isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Approve'}
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={handleReject}
                    disabled={!rulesetId || isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Reject'}
                  </button>
                </div>
              </div>

              {/* Phần kết quả */}
              <div className="space-y-4">
                <h3 className="font-medium">Kết quả</h3>
                <div className="border rounded-md p-4 bg-gray-50">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <p>Đang xử lý yêu cầu...</p>
                    </div>
                  ) : result ? (
                    <div>
                      <p className={`font-medium ${
                        result.status === "approved" ? "text-green-600" :
                        result.status === "rejected" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {result.message}
                      </p>
                      {result.data && (
                        <div className="mt-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">ID</p>
                              <p>{result.data.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Tên</p>
                              <p>{result.data.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Version</p>
                              <p>{result.data.version}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Trạng thái</p>
                              <p className={result.data.status === "approved" ? "text-green-600" : "text-red-600"}>
                                {result.data.status}
                              </p>
                            </div>
                            {result.data.status === "approved" && (
                              <>
                                <div>
                                  <p className="text-sm text-gray-500">Thời gian chấp thuận</p>
                                  <p>{new Date(result.data.approvedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Người chấp thuận</p>
                                  <p>{result.data.approvedBy}</p>
                                </div>
                              </>
                            )}
                            {result.data.status === "rejected" && (
                              <>
                                <div>
                                  <p className="text-sm text-gray-500">Thời gian từ chối</p>
                                  <p>{new Date(result.data.rejectedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Người từ chối</p>
                                  <p>{result.data.rejectedBy}</p>
                                </div>
                              </>
                            )}
                          </div>

                          {result.data.reason && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Lý do từ chối</p>
                              <p>{result.data.reason}</p>
                            </div>
                          )}

                          {result.data.content && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Rules</p>
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
                                    {result.data.content?.rules?.map((rule) => (
                                      <tr key={rule.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{rule.id}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{rule.name}</td>
                                        <td className="px-4 py-2 text-sm font-mono">{rule.condition}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}