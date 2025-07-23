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
    validationStatus: "invalid",
    content: {
      raw: "rules:\n- id: rule1\n- name: Convert to uppercase\n- condition: value.toUpperCase()\n- id: rule2\n- name: Format date\n- condition: new Date(value).toLocaleDateString()"
    }
  }
];

// Thêm ruleset mới
export function addRuleset(rulesets, ruleset) {
  return [...rulesets, ruleset];
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