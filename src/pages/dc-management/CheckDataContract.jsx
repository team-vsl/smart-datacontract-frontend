import { useState } from "react";
import { approveDataContract, rejectDataContract, getDataContractById } from "../../states/data-contract-state";

export function CheckDataContract({ dataContracts, setDataContracts }) {
  // State cho input và kết quả
  const [dataContractId, setDataContractId] = useState("");
  const [result, setResult] = useState(null);
  // State cho accordion
  const [isOpen, setIsOpen] = useState(true);

  // Hàm xử lý khi approve data contract
  const handleApprove = () => {
    if (!dataContractId) return;
    
    // Kiểm tra data contract có tồn tại không
    const contract = getDataContractById(dataContracts, dataContractId);
    if (!contract) {
      setResult({
        status: "error",
        message: `Không tìm thấy Data Contract với ID: ${dataContractId}`,
        data: null
      });
      return;
    }
    
    // Approve data contract và cập nhật state
    const updatedContracts = approveDataContract(dataContracts, dataContractId);
    setDataContracts(updatedContracts);
    
    // Lấy contract đã cập nhật
    const updatedContract = getDataContractById(updatedContracts, dataContractId);
    
    setResult({
      status: "approved",
      message: `Data Contract ${dataContractId} đã được chấp thuận`,
      data: {
        ...updatedContract,
        status: "approved"
      }
    });
  };

  // Hàm xử lý khi reject data contract
  const handleReject = () => {
    if (!dataContractId) return;
    
    // Kiểm tra data contract có tồn tại không
    const contract = getDataContractById(dataContracts, dataContractId);
    if (!contract) {
      setResult({
        status: "error",
        message: `Không tìm thấy Data Contract với ID: ${dataContractId}`,
        data: null
      });
      return;
    }
    
    // Reject data contract và cập nhật state
    const updatedContracts = rejectDataContract(dataContracts, dataContractId);
    setDataContracts(updatedContracts);
    
    // Lấy contract đã cập nhật
    const updatedContract = getDataContractById(updatedContracts, dataContractId);
    
    setResult({
      status: "rejected",
      message: `Data Contract ${dataContractId} đã bị từ chối`,
      data: {
        ...updatedContract,
        status: "rejected"
      }
    });
  };

  return (
    <div className="w-full">
      <div className="border rounded-md mb-4">
        {/* Accordion Header */}
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg font-medium">Check Data Contract</h2>
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
                    placeholder="Nhập Data Contract ID hoặc Name"
                    value={dataContractId}
                    onChange={(e) => setDataContractId(e.target.value)}
                  />
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleApprove}
                    disabled={!dataContractId}
                  >
                    Approve
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={handleReject}
                    disabled={!dataContractId}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Phần kết quả */}
              <div className="space-y-4">
                <h3 className="font-medium">Kết quả</h3>
                <div className="border rounded-md p-4 bg-gray-50">
                  {result ? (
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

                          {result.data.schema && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Schema</p>
                              <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-auto mt-1">
                                {JSON.stringify(result.data.schema, null, 2)}
                              </pre>
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