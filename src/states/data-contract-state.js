// Dữ liệu mẫu ban đầu
export const initialDataContracts = [
  { id: "dc-001", name: "Customer Data", version: "1.2.0", state: "pending", createdAt: new Date().toISOString().split('T')[0] },
  { id: "dc-002", name: "Product Catalog", version: "2.0.1", state: "pending", createdAt: new Date().toISOString().split('T')[0] },
  { id: "dc-003", name: "Transaction History", version: "1.0.5", state: "pending", createdAt: new Date().toISOString().split('T')[0] },
];

// Hàm để approve một data contract
export function approveDataContract(contracts, id) {
  return contracts.map(contract => 
    contract.id === id ? { 
      ...contract, 
      state: "active",
      owner: "Data Engineer",
      description: "This is an approved data contract",
      schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          value: { type: "number" }
        }
      },
      approvedAt: new Date().toISOString(),
      approvedBy: "Data Engineer",
      createdAt: new Date().toISOString().split('T')[0] // Chỉ lấy phần ngày YYYY-MM-DD
    } : contract
  );
}

// Hàm để reject một data contract
export function rejectDataContract(contracts, id) {
  return contracts.map(contract => 
    contract.id === id ? { 
      ...contract, 
      state: "archived",
      owner: "Data Engineer",
      description: "This data contract was rejected",
      schema: { // Thêm schema
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          value: { type: "number" }
        }
      },
      rejectedAt: new Date().toISOString(),
      rejectedBy: "Data Engineer",
      reason: "Data schema không đáp ứng yêu cầu",
      createdAt: new Date().toISOString().split('T')[0] // Chỉ lấy phần ngày YYYY-MM-DD
    } : contract
  );
}

// Hàm để lấy data contracts theo trạng thái
export function getDataContractsByState(contracts, state) {
  return contracts.filter(contract => contract.state === state);
}

// Hàm để lấy một data contract theo id
export function getDataContractById(contracts, id) {
  return contracts.find(contract => contract.id === id);
}