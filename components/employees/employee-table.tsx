import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAnnualIncome, formatDepartment } from "@/lib/employees/format";
import { type Employee } from "@/lib/employees/schema";

type EmployeeTableProps = {
  employees: Employee[];
};

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Card className="border border-border/70 bg-card/85 shadow-sm ring-0">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Employees</CardTitle>
          </div>
          <Badge variant="secondary">{employees.length} records</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Personnel #</TableHead>
              <TableHead className="text-right">Age</TableHead>
              <TableHead className="text-right">Income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <EmptyRow message="No employees yet. Use the form to create the first record." />
            ) : null}

            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{formatDepartment(employee.department)}</TableCell>
                <TableCell className="max-w-56 text-muted-foreground">
                  <span className="line-clamp-2">
                    {employee.jobDescription}
                  </span>
                </TableCell>
                <TableCell>{employee.personnelNumber}</TableCell>
                <TableCell className="text-right">{employee.age}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatAnnualIncome(employee.annualIncome)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className="py-10 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
