"use client";

import { useQuery } from "@tanstack/react-query";

import { EmployeeCreateForm } from "@/components/employees/employee-create-form";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EMPLOYEES_QUERY_KEY } from "@/lib/employees/query";
import { type Employee } from "@/lib/employees/schema";

type EmployeeDashboardProps = {
  initialEmployees: Employee[];
};

export function EmployeeDashboard({
  initialEmployees,
}: EmployeeDashboardProps) {
  const { data: employees = [] } = useQuery<Employee[]>({
    initialData: initialEmployees,
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: async () => initialEmployees,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 pt-10">
          <EmployeeTable employees={employees} />
        </div>
        <div className="w-full pt-10 xl:sticky xl:top-0 xl:w-[24rem] xl:flex-none">
          <EmployeeCreateForm />
        </div>
      </div>
    </div>
  );
}
