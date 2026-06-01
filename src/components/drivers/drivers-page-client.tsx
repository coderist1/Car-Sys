"use client";

import { useMemo, useState } from "react";
import { Plus, Star, Calendar, FileText, IdCard, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { RenewalBadge } from "@/components/shared/renewal-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { Label } from "@/components/ui/label";
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateOnly } from "@/lib/format-date";
import type {
  DriverAvailability,
  DriverDetails,
  EmploymentStatus,
  RenewalStatus,
} from "@/lib/db/types";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import { getBookingsSnapshot } from "@/lib/db/data-store";
import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "@/lib/db/data-store";

type DriverRow = DriverDetails & {
  assignedVehicle?: { plateNumber?: string };
  activeBookings: number;
};

type RenewalTarget = { driverId: number; type: "license" | "registration" } | null;

export function DriversPageClient({
  initialDrivers: _initial,
}: {
  initialDrivers: DriverRow[];
}) {
  const version = useDataStoreVersion();
  const bookings = useMemo(() => getBookingsSnapshot(), [version]);
  const drivers: DriverRow[] = useMemo(
    () =>
      getDrivers().map((d) => ({
        ...d,
        activeBookings: bookings.filter(
          (b) => b.driver_id === d.driver_id && ["active", "confirmed"].includes(b.status)
        ).length,
      })),
    [version, bookings]
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DriverDetails | null>(null);
  const [renewalTarget, setRenewalTarget] = useState<RenewalTarget>(null);
  const [renewalDate, setRenewalDate] = useState("");
  const [addForm, setAddForm] = useState({
    full_name: "",
    license_number: "",
    contact_number: "",
    experience_years: 1,
    license_expiry: "",
    registration_expiry: "",
  });

  const licenseRenewals = drivers.filter((d) => d.license_renewal_status !== "valid");
  const regRenewals = drivers.filter((d) => d.registration_renewal_status !== "valid");

  const handleAddDriver = () => {
    if (!addForm.full_name || !addForm.license_number) return;
    createDriver({
      full_name: addForm.full_name,
      license_number: addForm.license_number,
      contact_number: addForm.contact_number,
      availability: "available" as DriverAvailability,
      experience_years: addForm.experience_years,
      rating: 4.5,
      employment_status: "active" as EmploymentStatus,
      license_expiry: addForm.license_expiry || "2027-01-01",
      registration_expiry: addForm.registration_expiry || "2027-01-01",
      license_renewal_status: "valid" as RenewalStatus,
      registration_renewal_status: "valid" as RenewalStatus,
    });
    setAddOpen(false);
    setAddForm({
      full_name: "",
      license_number: "",
      contact_number: "",
      experience_years: 1,
      license_expiry: "",
      registration_expiry: "",
    });
  };

  const handleRenewal = () => {
    if (!renewalTarget || !renewalDate) return;
    const d = drivers.find((x) => x.driver_id === renewalTarget.driverId);
    if (!d) return;
    if (renewalTarget.type === "license") {
      updateDriver(d.driver_id, {
        license_expiry: renewalDate,
        license_renewal_status: "valid",
      });
    } else {
      updateDriver(d.driver_id, {
        registration_expiry: renewalDate,
        registration_renewal_status: "valid",
      });
    }
    setRenewalTarget(null);
    setRenewalDate("");
  };

  const renewalDriver = renewalTarget
    ? drivers.find((d) => d.driver_id === renewalTarget.driverId)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers Management"
        description="Driver fleet, license renewal, and registration renewal tracking."
      >
        <PageActionButton type="button" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 shrink-0" />
          <span className="truncate">Add Driver</span>
        </PageActionButton>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Driver</DialogTitle>
              <DialogDescription>New driver_details record</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={addForm.full_name}
                  onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input
                    value={addForm.license_number}
                    onChange={(e) =>
                      setAddForm({ ...addForm, license_number: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact</Label>
                  <Input
                    value={addForm.contact_number}
                    onChange={(e) =>
                      setAddForm({ ...addForm, contact_number: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  value={addForm.experience_years}
                  onChange={(e) =>
                    setAddForm({ ...addForm, experience_years: +e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>License Expiry</Label>
                  <HydrationDateInput
                    value={addForm.license_expiry}
                    onChange={(e) =>
                      setAddForm({ ...addForm, license_expiry: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration Expiry</Label>
                  <HydrationDateInput
                    value={addForm.registration_expiry}
                    onChange={(e) =>
                      setAddForm({ ...addForm, registration_expiry: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleAddDriver}>
                Add Driver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!renewalTarget}
          onOpenChange={(o) => !o && setRenewalTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {renewalTarget?.type === "license"
                  ? "Renewal of Driver's License"
                  : "Renewal Registration"}
              </DialogTitle>
              <DialogDescription>
                {renewalDriver?.full_name} — update expiry date
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label>New Expiry Date</Label>
              <HydrationDateInput
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
              />
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setRenewalTarget(null)}
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleRenewal}>
                Confirm Renewal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Driver</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={addForm.full_name}
                  onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact</Label>
                <Input
                  value={addForm.contact_number}
                  onChange={(e) => setAddForm({ ...addForm, contact_number: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!editing) return;
                  updateDriver(editing.driver_id, {
                    full_name: addForm.full_name,
                    contact_number: addForm.contact_number,
                  });
                  setEditOpen(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Available Now</CardDescription>
            <CardTitle className="text-2xl">
              {drivers.filter((d) => d.availability === "available").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>On Trip</CardDescription>
            <CardTitle className="text-2xl">
              {drivers.filter((d) => d.availability === "on_trip").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>License Renewal Due</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{licenseRenewals.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Registration Renewal Due</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{regRenewals.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IdCard className="h-4 w-4 text-primary" />
              Renewal of Driver&apos;s License
            </CardTitle>
            <CardDescription>Track and renew expiring driver licenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {drivers.map((d) => (
              <div
                key={`lic-${d.driver_id}`}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{d.full_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{d.license_number}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Expires {formatDateOnly(d.license_expiry, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <RenewalBadge status={d.license_renewal_status} />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 w-full gap-1 text-xs sm:w-auto cursor-pointer"
                    onClick={() => {
                      setRenewalTarget({ driverId: d.driver_id, type: "license" });
                      setRenewalDate(d.license_expiry);
                    }}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Renew License
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Renewal Registration
            </CardTitle>
            <CardDescription>Fleet / professional registration renewal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {drivers.map((d) => (
              <div
                key={`reg-${d.driver_id}`}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{d.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Vehicle: {d.assignedVehicle?.plateNumber ?? "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Expires {formatDateOnly(d.registration_expiry, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <RenewalBadge status={d.registration_renewal_status} />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 w-full gap-1 text-xs sm:w-auto cursor-pointer"
                    onClick={() => {
                      setRenewalTarget({ driverId: d.driver_id, type: "registration" });
                      setRenewalDate(d.registration_expiry);
                    }}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Renew Registration
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="hidden md:table-cell">License</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="hidden sm:table-cell">License Exp.</TableHead>
                <TableHead className="hidden sm:table-cell">Reg. Exp.</TableHead>
                <TableHead className="hidden md:table-cell">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.driver_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {d.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{d.full_name}</p>
                        <p className="text-xs text-muted-foreground">#{d.driver_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">
                    {d.license_number}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {d.contact_number}
                  </TableCell>
                  <TableCell className="text-sm">
                    {d.assignedVehicle?.plateNumber ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="driver" status={d.availability} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <RenewalBadge status={d.license_renewal_status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <RenewalBadge status={d.registration_renewal_status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {d.rating}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditing(d);
                        setAddForm({
                          full_name: d.full_name,
                          license_number: d.license_number,
                          contact_number: d.contact_number,
                          experience_years: d.experience_years,
                          license_expiry: d.license_expiry,
                          registration_expiry: d.registration_expiry,
                        });
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (!deleteDriver(d.driver_id)) {
                          window.alert("Cannot delete: driver has active bookings.");
                        }
                      }}
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
            Driver Schedule
          </CardTitle>
          <CardDescription>Performance overview by availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {drivers.map((d) => (
            <div key={d.driver_id} className="space-y-1">
              <div className="flex justify-between text-sm gap-2">
                <span className="truncate">{d.full_name}</span>
                <span className="text-muted-foreground shrink-0">
                  {d.availability === "on_trip" ? "85%" : d.availability === "available" ? "40%" : "0%"}
                </span>
              </div>
              <Progress
                value={
                  d.availability === "on_trip" ? 85 : d.availability === "available" ? 40 : 0
                }
                className="h-1.5"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
