import { z } from "zod";

export const departmentValues = [
  "SOFTWARE_DEVELOPMENT",
  "PROJECT_MANAGEMENT",
  "HUMAN_RESOURCES",
] as const;

export const departmentSchema = z.enum(departmentValues);

export type Department = z.infer<typeof departmentSchema>;

export const employeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  personnelNumber: z.string(),
  department: departmentSchema,
  jobDescription: z.string(),
  annualIncome: z.number(),
});

export const employeeListSchema = z.array(employeeSchema);

export const createEmployeeRequestSchema = employeeSchema.omit({
  id: true,
});

export const createEmployeeFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  age: z
    .string()
    .trim()
    .min(1, "Age is required.")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: "Age must be a positive number.",
    }),
  personnelNumber: z.string().trim().min(1, "Personnel number is required."),
  department: z
    .string()
    .refine((value) => departmentValues.includes(value as Department), {
      message: "Department is required.",
    }),
  jobDescription: z.string().trim().min(1, "Job description is required."),
  annualIncome: z
    .string()
    .trim()
    .min(1, "Annual income is required.")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, {
      message: "Annual income must be zero or a positive number.",
    }),
});

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeePayload = z.infer<typeof createEmployeeRequestSchema>;
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeFormSchema>;
export type CreateEmployeeFormFieldErrors = Partial<
  Record<keyof CreateEmployeeFormValues, string>
>;

export const defaultCreateEmployeeFormValues: CreateEmployeeFormValues = {
  firstName: "",
  lastName: "",
  age: "",
  personnelNumber: "",
  department: "",
  jobDescription: "",
  annualIncome: "",
};

export function mapFormValuesToEmployeePayload(
  values: CreateEmployeeFormValues,
): CreateEmployeePayload {
  return createEmployeeRequestSchema.parse({
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    age: Number(values.age),
    personnelNumber: values.personnelNumber.trim(),
    department: departmentSchema.parse(values.department),
    jobDescription: values.jobDescription.trim(),
    annualIncome: Number(values.annualIncome),
  });
}

export function validateCreateEmployeeForm(values: CreateEmployeeFormValues) {
  const result = createEmployeeFormSchema.safeParse(values);

  if (result.success) {
    return {
      success: true as const,
      data: result.data,
    };
  }

  const fieldErrors: CreateEmployeeFormFieldErrors = {};

  for (const issue of result.error.issues) {
    const fieldName = issue.path[0];

    if (typeof fieldName !== "string") {
      continue;
    }

    const key = fieldName as keyof CreateEmployeeFormValues;

    if (fieldErrors[key]) {
      continue;
    }

    fieldErrors[key] = issue.message;
  }

  return {
    success: false as const,
    fieldErrors,
  };
}
