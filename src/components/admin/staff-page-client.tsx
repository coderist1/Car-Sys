"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import {
  createStaff,
  deleteStaff,
  getStaffInfo,
  getUsers,
  updateStaff,
} from "@/lib/db/data-store";
import type { StaffInfo } from "@/lib/db/types";

export function StaffPageClient() {
  const version = useDataStoreVersion();
  const staff = useMemo(() => getStaffInfo(), [version]);
  const users = useMemo(() => getUsers(), [version]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffInfo | null>(null);
  const [form, setForm] = useState({
    user_id: "",
    fullName: "",
    department: "",
    phone: "",
    hire_date: new Date().toISOString().slice(0, 10),
  });

  const staffUsers = users.filter((u) => u.role === "admin" || u.role === "manager" || u.role === "staff");

  function openCreate() {
    setEditing(null);
    setForm({
      user_id: staffUsers[0]?.user_id.toString() ?? "",
      fullName: "",
      department: "",
      phone: "",
      hire_date: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  }

  function openEdit(s: StaffInfo) {
    setEditing(s);
    setForm({
      user_id: String(s.user_id),
      fullName: s.fullName,
      department: s.department,
      phone: s.phone,
      hire_date: s.hire_date,
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.fullName || !form.user_id) return;
    const payload = {
      user_id: Number(form.user_id),
      fullName: form.fullName,
      department: form.department,
      phone: form.phone,
      hire_date: form.hire_date,
    };
    if (editing) {
      updateStaff(editing.staff_id, payload);
    } else {
      createStaff(payload);
    }
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Staff"
        description="Admin-only: staff_info records linked to user accounts."
      >
        <PageActionButton type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Staff
        </PageActionButton>
      </PageHeader>

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.staff_id}>
                  <TableCell className="font-medium">{s.fullName}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>{users.find((u) => u.user_id === s.user_id)?.email ?? "—"}</TableCell>
                  <TableCell>{s.hire_date}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteStaff(s.staff_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
            <DialogDescription>Links staff_info to an existing user account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>User account</Label>
              <Select value={form.user_id} onValueChange={(v) => setForm({ ...form, user_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {staffUsers.map((u) => (
                    <SelectItem key={u.user_id} value={String(u.user_id)}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Hire date</Label>
              <Input type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
