import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EmployeeDashboard } from "@/components/employees/employee-dashboard";
import { fetchEmployeesFromBackend } from "@/lib/employees/api";
import {
  EMPLOYEES_QUERY_KEY,
  EMPLOYEES_STALE_TIME,
} from "@/lib/employees/query";
import { type Employee } from "@/lib/employees/schema";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initialEmployees: Employee[] = [];

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: EMPLOYEES_STALE_TIME,
      },
    },
  });

  try {
    initialEmployees = await queryClient.fetchQuery({
      queryKey: EMPLOYEES_QUERY_KEY,
      queryFn: fetchEmployeesFromBackend,
    });
  } catch {
    initialEmployees = [];
  }

  return (
    <main className="min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EmployeeDashboard initialEmployees={initialEmployees} />
      </HydrationBoundary>
    </main>
  );
}
