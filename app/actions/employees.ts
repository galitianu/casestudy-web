"use server";

import { createEmployeeInBackend, getErrorMessage } from "@/lib/employees/api";
import {
  mapFormValuesToEmployeePayload,
  validateCreateEmployeeForm,
  type CreateEmployeeFormFieldErrors,
  type CreateEmployeeFormValues,
  type Employee,
} from "@/lib/employees/schema";

type CreateEmployeeActionSuccess = {
  ok: true;
  employee: Employee;
};

type CreateEmployeeActionFailure = {
  ok: false;
  fieldErrors?: CreateEmployeeFormFieldErrors;
  message: string;
};

export type CreateEmployeeActionResult =
  | CreateEmployeeActionSuccess
  | CreateEmployeeActionFailure;

export async function createEmployeeAction(
  values: CreateEmployeeFormValues
): Promise<CreateEmployeeActionResult> {
  const result = validateCreateEmployeeForm(values);

  if (!result.success) {
    return {
      ok: false as const,
      fieldErrors: result.fieldErrors,
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
