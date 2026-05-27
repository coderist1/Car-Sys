"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { formatNumber } from "@/lib/format-number";
import { PageActionButton } from "@/components/shared/page-action-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import type { VehicleWithReg, VehicleStatus } from "@/lib/db/types";

export function VehiclesPageClient({ initialVehicles }: { initialVehicles: VehicleWithReg[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selected, setSelected] = useState<VehicleWithReg | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleWithReg | null>(null);

  const types = useMemo(
    () => [...new Set(vehicles.map((v) => v.type))],
    [vehicles]
  );

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || v.status === statusFilter;
      const matchType = typeFilter === "all" || v.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, search, statusFilter, typeFilter]);

  const handleDelete = (id: number) => {
    setVehicles((prev) => prev.filter((v) => v.vehicle_id !== id));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Management"
        description="Manage fleet inventory linked to registration, maintenance, and fuel records."
      >
        <PageActionButton
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="truncate">Add Vehicle</span>
        </PageActionButton>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <VehicleFormDialog
            vehicle={editing}
            onClose={() => {
              setDialogOpen(false);
              setEditing(null);
            }}
            onSave={(v) => {
              if (editing) {
                setVehicles((prev) =>
                  prev.map((x) => (x.vehicle_id === v.vehicle_id ? { ...x, ...v } : x))
                );
              } else {
                setVehicles((prev) => [...prev, { ...v, vehicle_id: Date.now() }]);
              }
              setDialogOpen(false);
            }}
          />
        </Dialog>
      </PageHeader>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="relative w-full min-w-0 flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plate, brand, model..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Plate</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.vehicle_id}>
                    <TableCell className="font-mono text-xs">#{v.vehicle_id}</TableCell>
                    <TableCell className="font-medium">{v.plateNumber}</TableCell>
                    <TableCell>
                      {v.brand} {v.model}
                      <span className="block text-xs text-muted-foreground">
                        Cap. {v.capacity}
                      </span>
                    </TableCell>
                    <TableCell>{v.type}</TableCell>
                    <TableCell>{formatNumber(v.mileage)} mi</TableCell>
                    <TableCell>{v.year_model}</TableCell>
                    <TableCell>
                      <StatusBadge type="vehicle" status={v.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelected(v)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditing(v);
                            setDialogOpen(true);
                          }}
                          aria-label="Edit vehicle"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(v.vehicle_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selected.brand} {selected.model}
                </SheetTitle>
                <SheetDescription>{selected.plateNumber}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <DetailRow label="Vehicle ID" value={`#${selected.vehicle_id}`} />
                <DetailRow label="Status" value={<StatusBadge type="vehicle" status={selected.status} />} />
                <DetailRow label="Mileage" value={`${formatNumber(selected.mileage)} mi`} />
                <DetailRow label="Capacity" value={`${selected.capacity} seats`} />
                <DetailRow label="Year Model" value={String(selected.year_model)} />
                <DetailRow label="Year Purchased" value={String(selected.year_purchased)} />
                {selected.registration && (
                  <>
                    <hr className="border-border" />
                    <p className="font-medium text-foreground">Registration (vehicle_reg_details)</p>
                    <DetailRow label="Reg. Number" value={selected.registration.registration_number} />
                    <DetailRow label="Insurance" value={selected.registration.insurance_provider} />
                    <DetailRow label="Insurance Expiry" value={selected.registration.insurance_expiry} />
                  </>
                )}
                <DetailRow label="Maintenance Records" value={String(selected.maintenance_count ?? 0)} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function VehicleFormDialog({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: VehicleWithReg | null;
  onClose: () => void;
  onSave: (v: VehicleWithReg) => void;
}) {
  const [form, setForm] = useState({
    plateNumber: vehicle?.plateNumber ?? "",
    brand: vehicle?.brand ?? "",
    model: vehicle?.model ?? "",
    type: vehicle?.type ?? "Sedan",
    capacity: vehicle?.capacity ?? 5,
    mileage: vehicle?.mileage ?? 0,
    year_model: vehicle?.year_model ?? 2024,
    year_purchased: vehicle?.year_purchased ?? 2024,
    status: (vehicle?.status ?? "available") as VehicleStatus,
  });

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        <DialogDescription>Fields map to the vehicle ERD table.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-2 sm:grid-cols-2">
        {(
          [
            ["plateNumber", "Plate Number"],
            ["brand", "Brand"],
            ["model", "Model"],
            ["type", "Type"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <div className="space-y-2">
          <Label>Capacity</Label>
          <Input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Mileage</Label>
          <Input
            type="number"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: +e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Year Model</Label>
          <Input
            type="number"
            value={form.year_model}
            onChange={(e) => setForm({ ...form, year_model: +e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Year Purchased</Label>
          <Input
            type="number"
            value={form.year_purchased}
            onChange={(e) => setForm({ ...form, year_purchased: +e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as VehicleStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave({
              vehicle_id: vehicle?.vehicle_id ?? 0,
              ...form,
            })
          }
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
