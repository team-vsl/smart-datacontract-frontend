// Danh sách ruleset ban đầu chỉ có ruleset ở trạng thái pending
export const initialRulesets = [
  {
    id: "rs-001",
    name: "Data Quality Rules",
    version: "1.0.0",
    state: "pending",
    createdAt: "2025-07-20",
    validationStatus: "valid",
    content: {
      rules: [
        { id: "rule1", name: "Check null values", condition: "value != null" },
        { id: "rule2", name: "Check data type", condition: "typeof value === 'string'" }
      ]
    }
  },
  {
    id: "rs-002",
    name: "Validation Rules",
    version: "2.1.0",
    state: "pending",
    createdAt: "2025-07-18",
    validationStatus: "valid",
    content: {
      rules: [
        { id: "rule1", name: "Check range", condition: "value > 0 && value < 100" },
        { id: "rule2", name: "Check format", condition: "value.match(/^\d{4}-\d{2}-\d{2}$/)" }
      ]
    }
  },
  {
    id: "rs-003",
    name: "Transformation Rules",
    version: "1.2.3",
    state: "pending",
    createdAt: "2025-07-15",
    validationStatus: "valid",
    content: {
      rules: [
        { id: "rule1", name: "Convert to uppercase", condition: "value.toUpperCase()" },
        { id: "rule2", name: "Format date", condition: "new Date(value).toLocaleDateString()" }
      ]
    }
  }
];

// Thêm ruleset mới và xóa ruleset có cùng tên khỏi trạng thái pending
export function addRuleset(rulesets, ruleset) {
  console.log("addRuleset - Ruleset mới:", ruleset);
  console.log("addRuleset - Danh sách rulesets hiện tại:", rulesets);
  
  // Tìm ruleset có cùng tên ở trạng thái pending (không phân biệt chữ hoa/chữ thường)
  const existingRuleset = rulesets.find(r => 
    r.name.toLowerCase().trim() === ruleset.name.toLowerCase().trim() && 
    r.state === "pending"
  );
  
  console.log("addRuleset - Tìm thấy ruleset có cùng tên:", existingRuleset);
  
  // Nếu tìm thấy, sử dụng ID của ruleset đó
  if (existingRuleset) {
    console.log("addRuleset - Sử dụng ID của ruleset có sẵn:", existingRuleset.id);
    
    // Tạo ruleset mới với ID của ruleset cũ
    const updatedRuleset = {
      ...ruleset,
      id: existingRuleset.id
    };
    
    console.log("addRuleset - Ruleset đã cập nhật ID:", updatedRuleset);
    
    // Xóa ruleset cũ và thêm ruleset mới
    const result = [...rulesets.filter(r => 
      !(r.name.toLowerCase().trim() === ruleset.name.toLowerCase().trim() && r.state === "pending")
    ), updatedRuleset];
    
    console.log("addRuleset - Kết quả cuối cùng:", result);
    return result;
  }
  
  // Nếu không tìm thấy, thêm ruleset mới
  console.log("addRuleset - Không tìm thấy ruleset có cùng tên, thêm mới");
  const result = [...rulesets, ruleset];
  console.log("addRuleset - Kết quả cuối cùng:", result);
  return result;
}

// Lấy ruleset theo trạng thái
export function getRulesetsByState(rulesets, state) {
  if (!state) return [];
  console.log("Lọc ruleset theo trạng thái:", state);
  console.log("Danh sách rulesets trước khi lọc:", rulesets);
  const filtered = rulesets.filter(ruleset => ruleset.state === state);
  console.log("Danh sách rulesets sau khi lọc:", filtered);
  return filtered;
}

// Lấy ruleset theo ID
export function getRulesetById(rulesets, id) {
  return rulesets.find(ruleset => ruleset.id === id || ruleset.name === id);
}