"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormSetError } from "react-hook-form";

import {
  createEmployeeAction,
  type CreateEmployeeActionResult,
} from "@/app/actions/employees";
import { EmployeeTextField } from "@/components/employees/employee-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { EMPLOYEES_QUERY_KEY } from "@/lib/employees/query";
import {
  type Department,
  departmentValues,
  defaultCreateEmployeeFormValues,
  validateCreateEmployeeForm,
  type CreateEmployeeFormFieldErrors,
  type CreateEmployeeFormValues,
  type Employee,
} from "@/lib/employees/schema";
import { formatDepartment } from "@/lib/employees/format";

export function EmployeeCreateForm() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<CreateEmployeeFormValues>({
    defaultValues: defaultCreateEmployeeFormValues,
  });

  const createEmployeeMutation = useMutation<
    CreateEmployeeActionResult,
    Error,
    CreateEmployeeFormValues
  >({
    mutationFn: createEmployeeAction,
    onSuccess: (result) => {
      if (!result.ok) {
        setServerError(result.message);
        applyFieldErrors(form.setError, result.fieldErrors);

        return;
      }

      setServerError(null);
      form.reset();
      queryClient.setQueryData<Employee[]>(
        EMPLOYEES_QUERY_KEY,
        (current = []) => {
          if (current.some((employee) => employee.id === result.employee.id)) {
            return current;
          }

          return [...current, result.employee];
        },
      );
    },
  });

  function onSubmit(values: CreateEmployeeFormValues) {
    const result = validateCreateEmployeeForm(values);

    if (!result.success) {
      form.clearErrors();
      applyFieldErrors(form.setError, result.fieldErrors);

      return;
    }

    form.clearErrors();
    setServerError(null);
    createEmployeeMutation.mutate(result.data);
  }

  return (
    <Card className="w-full border border-border/70 bg-card/85 shadow-sm ring-0">
      <CardHeader>
        <CardTitle>Add employee</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                disabled={createEmployeeMutation.isPending}
                name="firstName"
                label="First name"
                placeholder="Max"
              />
              <EmployeeTextField
                control={form.control}
                disabled={createEmployeeMutation.isPending}
                name="lastName"
                label="Last name"
                placeholder="Mustermann"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                disabled={createEmployeeMutation.isPending}
                name="age"
                label="Age"
                placeholder="29"
                type="number"
                inputMode="numeric"
              />
              <EmployeeTextField
                control={form.control}
                disabled={createEmployeeMutation.isPending}
                name="annualIncome"
                label="Annual income"
                placeholder="85000"
                type="number"
                inputMode="decimal"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EmployeeTextField
                control={form.control}
                disabled={createEmployeeMutation.isPending}
                name="personnelNumber"
                label="Personnel number"
                placeholder="EMP-104"
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      disabled={createEmployeeMutation.isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {field.value
                              ? formatDepartment(field.value as Department)
                              : "Select department"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentValues.map((department) => (
                          <SelectItem key={department} value={department}>
                            {formatDepartment(department)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={createEmployeeMutation.isPending}
                      placeholder="Owns frontend delivery for the internal tools platform."
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Keep it short and specific to the role.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {serverError ? (
              <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            ) : null}

            <Button disabled={createEmployeeMutation.isPending} type="submit">
              <PlusIcon data-icon="inline-start" />
              {createEmployeeMutation.isPending
                ? "Creating..."
                : "Create employee"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function applyFieldErrors(
  setError: UseFormSetError<CreateEmployeeFormValues>,
  fieldErrors?: CreateEmployeeFormFieldErrors,
) {
  if (!fieldErrors) {
    return;
  }

  for (const [fieldName, message] of Object.entries(fieldErrors)) {
    if (!message) {
      continue;
    }

    setError(fieldName as keyof CreateEmployeeFormValues, {
      type: "manual",
      message,
    });
  }
}
