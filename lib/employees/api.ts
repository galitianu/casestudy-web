import { z, type ZodType } from "zod";

import {
  createEmployeeRequestSchema,
  employeeListSchema,
  employeeSchema,
  type CreateEmployeePayload,
} from "@/lib/employees/schema";

const EMPLOYEE_API_BASE_URL = process.env.EMPLOYEE_API_URL;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function buildBackendUrl(pathname: string) {
  return new URL(pathname, EMPLOYEE_API_BASE_URL).toString();
}

async function readJsonPayload(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

async function ensureOk(response: Response) {
  if (response.ok) {
    return;
  }

  const payload = await readJsonPayload(response);
  const message =
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
      ? payload.message
      : `Request failed with status ${response.status}`;

  throw new ApiRequestError(message, response.status);
}

async function parseResponse<T>(response: Response, schema: ZodType<T>) {
  await ensureOk(response);
  return schema.parse(await response.json());
}

export async function fetchEmployeesFromBackend() {
  const response = await fetch(buildBackendUrl("/employee"), {
    cache: "no-store",
  });

  return parseResponse(response, employeeListSchema);
}

export async function createEmployeeInBackend(payload: CreateEmployeePayload) {
  const parsedPayload = createEmployeeRequestSchema.parse(payload);
  const response = await fetch(buildBackendUrl("/employee"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsedPayload),
  });

  return parseResponse(response, employeeSchema);
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof z.ZodError) {
    return "Employee data failed validation.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while talking to the employee service.";
}
