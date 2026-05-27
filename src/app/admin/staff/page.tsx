import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { staffInfo, users } from "@/lib/db/mock-data";

export default function ManageStaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Staff"
        description="Admin-only UML use case: staff_info linked to user accounts."
      />
      <Card className="border-border/60">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email (user)</TableHead>
                <TableHead>Hire date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffInfo.map((s) => (
                <TableRow key={s.staff_id}>
                  <TableCell className="font-medium">{s.fullName}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>
                    {users.find((u) => u.user_id === s.user_id)?.email ?? "—"}
                  </TableCell>
                  <TableCell>{s.hire_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
