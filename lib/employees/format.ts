import { type Department } from "@/lib/employees/schema";

export function formatAnnualIncome(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const departmentLabels: Record<Department, string> = {
  SOFTWARE_DEVELOPMENT: "Software development",
  PROJECT_MANAGEMENT: "Project management",
  HUMAN_RESOURCES: "Human resources",
};

export function formatDepartment(value: Department) {
  return departmentLabels[value];
}
