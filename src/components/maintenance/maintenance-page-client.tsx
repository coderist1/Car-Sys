"use client";

import { useMemo, useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { MaintenanceStatus } from "@/lib/db/types";
import type { Vehicle } from "@/lib/db/types";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import {
  createMaintenance,
  deleteMaintenance,
  getMaintenanceRecords,
  getVehicles,
  updateMaintenance,
} from "@/lib/db/data-store";

type MaintenanceRow = ReturnType<
  typeof import("@/lib/db/queries").getAllMaintenance
>[0];

export function MaintenancePageClient({
  initialRecords: _initial,
  vehicles: _vehicles,
}: {
  initialRecords: MaintenanceRow[];
  vehicles: Vehicle[];
}) {
  const version = useDataStoreVersion();
  const vehicles = useMemo(() => getVehicles(), [version]);
  const records: MaintenanceRow[] = useMemo(
    () =>
      getMaintenanceRecords().map((m) => ({
        ...m,
        vehicle: vehicles.find((v) => v.vehicle_id === m.vehicle_id),
        registration: undefined,
      })),
    [version, vehicles]
  );
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    vehicle_id: "",
    service_type: "",
    assigned_mechanic: "",
    service_date: "",
    cost: 0,
    notes: "",
    status: "pending" as MaintenanceStatus,
  });

  const upcoming = records.filter((r) => r.status !== "completed");

  const handleSchedule = () => {
    const vehicle = vehicles.find((v) => v.vehicle_id === Number(form.vehicle_id));
    if (!vehicle || !form.service_type || !form.service_date) return;

    createMaintenance({
      vehicle_id: vehicle.vehicle_id,
      service_type: form.service_type,
      assigned_mechanic: form.assigned_mechanic || "Unassigned",
      service_date: form.service_date,
      cost: form.cost,
      status: form.status,
      notes: form.notes,
    });
    setOpen(false);
    setForm({
      vehicle_id: "",
      service_type: "",
      assigned_mechanic: "",
      service_date: "",
      cost: 0,
      notes: "",
      status: "pending",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Service records from vehicle_maintenance linked to vehicle and vehicle_reg_details."
      >
        <PageActionButton type="button" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 shrink-0" />
          <span className="truncate">Schedule Maintenance</span>
        </PageActionButton>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>Add a new vehicle_maintenance record</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select
                  value={form.vehicle_id}
                  onValueChange={(v) => setForm({ ...form, vehicle_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.vehicle_id} value={String(v.vehicle_id)}>
                        {v.plateNumber} — {v.brand} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Input
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  placeholder="e.g. Oil Change"
                />
              </div>
              <div className="space-y-2">
                <Label>Assigned Mechanic</Label>
                <Input
                  value={form.assigned_mechanic}
                  onChange={(e) => setForm({ ...form, assigned_mechanic: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service Date</Label>
                  <HydrationDateInput
                    value={form.service_date}
                    onChange={(e) => setForm({ ...form, service_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost ($)</Label>
                  <Input
                    type="number"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: +e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as MaintenanceStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleSchedule}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle>Service Records</CardTitle>
            <CardDescription>vehicle_maintenance × vehicle</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Mechanic</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.maintenance_id}>
                    <TableCell className="font-mono text-xs">#{r.maintenance_id}</TableCell>
                    <TableCell>
                      {r.vehicle?.plateNumber}
                      <span className="block text-xs text-muted-foreground">
                        {r.vehicle?.brand} {r.vehicle?.model}
                      </span>
                    </TableCell>
                    <TableCell>{r.service_type}</TableCell>
                    <TableCell>{r.assigned_mechanic}</TableCell>
                    <TableCell>{r.service_date}</TableCell>
                    <TableCell>${r.cost}</TableCell>
                    <TableCell>
                      <StatusBadge type="maintenance" status={r.status} />
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs">
                      {r.notes}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Select
                        value={r.status}
                        onValueChange={(v) =>
                          updateMaintenance(r.maintenance_id, {
                            status: v as MaintenanceStatus,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive inline-flex"
                        onClick={() => deleteMaintenance(r.maintenance_id)}
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

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((r) => (
              <div key={r.maintenance_id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{r.service_type}</p>
                <p className="text-xs text-muted-foreground">
                  {r.vehicle?.plateNumber} · {r.service_date}
                </p>
                <StatusBadge type="maintenance" status={r.status} className="mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Maintenance Calendar</CardTitle>
          <CardDescription>Scheduled services by date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {records.map((r) => (
              <div
                key={r.maintenance_id}
                className="rounded-lg border p-3 text-xs hover:bg-muted/30"
              >
                <p className="font-medium">{r.service_date}</p>
                <p className="text-muted-foreground mt-1">{r.vehicle?.plateNumber}</p>
                <p>{r.service_type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
