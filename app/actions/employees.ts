"use server";

import { createEmployeeInBackend, getErrorMessage } from "@/lib/employees/api";
import {
  createEmployeeFormSchema,
  mapFormValuesToEmployeePayload,
  type CreateEmployeeFormValues,
  type Employee,
} from "@/lib/employees/schema";

type CreateEmployeeActionSuccess = {
  ok: true;
  employee: Employee;
};

type CreateEmployeeActionFailure = {
  ok: false;
  fieldErrors?: Partial<Record<keyof CreateEmployeeFormValues, string>>;
  message: string;
};

export type CreateEmployeeActionResult =
  | CreateEmployeeActionSuccess
  | CreateEmployeeActionFailure;

export async function createEmployeeAction(
  values: CreateEmployeeFormValues
): Promise<CreateEmployeeActionResult> {
  const result = createEmployeeFormSchema.safeParse(values);

  if (!result.success) {
    const fieldErrors: Partial<Record<keyof CreateEmployeeFormValues, string>> =
      {};

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
      ok: false as const,
      fieldErrors,
      message: "Please correct the highlighted fields.",
    };
  }

  try {
    const payload = mapFormValuesToEmployeePayload(result.data);
    const employee = await createEmployeeInBackend(payload);

    return {
      ok: true as const,
      employee,
    };
  } catch (error) {
    return {
      ok: false as const,
      message: getErrorMessage(error),
    };
  }
}
