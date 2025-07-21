import { useState } from "react";

export function DataContractAccordion() {
  // State cho danh sách data contract
  const [dataContracts, setDataContracts] = useState([]);
  // State cho data contract chi tiết
  const [selectedContract, setSelectedContract] = useState(null);
  // State cho các input
  const [contractState, setContractState] = useState("");
  const [contractId, setContractId] = useState("");
  // State cho accordion
  const [isOpen, setIsOpen] = useState(false);

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = (value) => {
    setContractState(value);
    // Gọi API để lấy danh sách data contract theo trạng thái
    fetchDataContractsByState(value);
  };

  // Hàm xử lý khi submit ID/tên data contract
  const handleGetContract = () => {
    if (!contractId) return;
    // Gọi API để lấy thông tin chi tiết của data contract
    fetchDataContractById(contractId);
  };

  // Giả lập hàm gọi API lấy danh sách data contract theo trạng thái
  const fetchDataContractsByState = (state) => {
    // Giả lập dữ liệu
    const mockData = [
      { id: "dc-001", name: "Customer Data", version: "1.2.0", state: state },
      { id: "dc-002", name: "Product Catalog", version: "2.0.1", state: state },
      { id: "dc-003", name: "Transaction History", version: "1.0.5", state: state },
    ];
    setDataContracts(mockData);
  };

  // Giả lập hàm gọi API lấy chi tiết data contract
  const fetchDataContractById = (id) => {
    // Giả lập dữ liệu
    const mockContract = {
      id: id,
      name: "Sample Data Contract",
      version: "1.0.0",
      state: "active",
      description: "This is a sample data contract for demonstration",
      schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          value: { type: "number" }
        }
      },
      owner: "Data Engineering Team",
      createdAt: "2023-10-15"
    };
    setSelectedContract(mockContract);
  };

  return (
    <div className="w-full">
      <div className="border rounded-md mb-4">
        {/* Accordion Header */}
        <div 
          className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-lg font-medium">Get/List Data Contract</h2>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
        
        {/* Accordion Content */}
        {isOpen && (
          <div className="p-4 border-t">
            <div className="space-y-6">
              {/* Phần tương tác */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                {/* List Data Contract - Dropdown chọn state */}
                <div className="space-y-2">
                  <h3 className="font-medium">List Data Contracts</h3>
                  <select 
                    className="w-full p-2 border rounded-md" 
                    onChange={(e) => handleStateChange(e.target.value)}
                    value={contractState}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="pending">Đang chờ xử lý</option>
                    <option value="archived">Đã lưu trữ</option>
                  </select>
                </div>

                {/* Get Data Contract - Input ID/Name và nút Submit */}
                <div className="space-y-2">
                  <h3 className="font-medium">Get Data Contract</h3>
                  <div className="flex space-x-2">
                    <input
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Nhập ID hoặc tên Data Contract"
                      value={contractId}
                      onChange={(e) => setContractId(e.target.value)}
                    />
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={handleGetContract}
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              {/* Phần kết quả (view) */}
              <div className="space-y-4">
                {/* Hiển thị danh sách data contract */}
                {dataContracts.length > 0 && contractState && !selectedContract && (
                  <div>
                    <h3 className="font-medium mb-2">Danh sách Data Contract - Trạng thái: {contractState}</h3>
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
                          {dataContracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedContract(contract)}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{contract.version}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  contract.state === 'active' ? 'bg-green-100 text-green-800' :
                                  contract.state === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {contract.state}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Hiển thị chi tiết data contract */}
                {selectedContract && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Chi tiết Data Contract</h3>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => setSelectedContract(null)}
                      >
                        Quay lại danh sách
                      </button>
                    </div>
                    <div className="border rounded-md p-4 bg-white">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">ID</p>
                          <p>{selectedContract.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tên</p>
                          <p>{selectedContract.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Version</p>
                          <p>{selectedContract.version}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Trạng thái</p>
                          <p>{selectedContract.state}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Owner</p>
                          <p>{selectedContract.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày tạo</p>
                          <p>{selectedContract.createdAt}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Mô tả</p>
                        <p>{selectedContract.description}</p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Schema</p>
                        <pre className="bg-gray-50 p-2 rounded-md text-xs overflow-auto mt-1">
                          {JSON.stringify(selectedContract.schema, null, 2)}
                        </pre>
                      </div>
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