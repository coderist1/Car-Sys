"use client";

import { useMemo, useState } from "react";
import { Search, Eye, Ban, CheckCircle, UserPlus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerInfo } from "@/lib/db/types";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/lib/db/data-store";
import { getCustomerRentalHistory } from "@/lib/db/queries";

export function CustomersPageClient() {
  const version = useDataStoreVersion();
  const customers = useMemo(() => getCustomers(), [version]);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<CustomerInfo | null>(null);
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selected, setSelected] = useState<CustomerInfo | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerFullName: "",
    address: "",
    driverLicense: "",
    phone: "",
    email: "",
  });

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const match =
        !q ||
        c.customerFullName.toLowerCase().includes(q) ||
        c.driverLicense.toLowerCase().includes(q);
      const matchV =
        verificationFilter === "all" || c.verification_status === verificationFilter;
      return match && matchV;
    });
  }, [customers, search, verificationFilter]);

  const history = useMemo(
    () => (selected ? getCustomerRentalHistory(selected.user_id) : []),
    [selected, version]
  );

  const toggleSuspend = (userId: number) => {
    const c = customers.find((x) => x.user_id === userId);
    if (!c) return;
    const updated = updateCustomer(userId, { is_suspended: !c.is_suspended });
    if (selected?.user_id === userId && updated) setSelected(updated);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Customer profiles extending the user table via customer_info."
      >
        <PageActionButton type="button" onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4 shrink-0" />
          <span className="truncate">Add Customer</span>
        </PageActionButton>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Customer</DialogTitle>
              <DialogDescription>New customer_info record linked to user</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={newCustomer.customerFullName}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, customerFullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Driver License</Label>
                <Input
                  value={newCustomer.driverLicense}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, driverLicense: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  if (!newCustomer.customerFullName || !newCustomer.driverLicense) return;
                  createCustomer(newCustomer);
                  setAddOpen(false);
                  setNewCustomer({
                    customerFullName: "",
                    address: "",
                    driverLicense: "",
                    phone: "",
                    email: "",
                  });
                }}
              >
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name or license..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.user_id}>
                    <TableCell className="font-mono text-xs">#{c.user_id}</TableCell>
                    <TableCell className="font-medium">{c.customerFullName}</TableCell>
                    <TableCell className="font-mono text-xs">{c.driverLicense}</TableCell>
                    <TableCell>
                      <StatusBadge type="verification" status={c.verification_status} />
                    </TableCell>
                    <TableCell>
                      {c.is_suspended ? (
                        <span className="text-xs text-destructive font-medium">Suspended</span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">Active</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelected(c)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditForm(c);
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
                          if (!deleteCustomer(c.user_id)) {
                            window.alert("Cannot delete: customer has bookings.");
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
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editForm.customerFullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, customerFullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Verification</Label>
                <Select
                  value={editForm.verification_status}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      verification_status: v as CustomerInfo["verification_status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editForm) return;
                const updated = updateCustomer(editForm.user_id, editForm);
                if (updated) setSelected((s) => (s?.user_id === updated.user_id ? updated : s));
                setEditOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.customerFullName}</SheetTitle>
                <SheetDescription>user_id: {selected.user_id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Info label="Address" value={selected.address} />
                <Info label="Driver License" value={selected.driverLicense} />
                <Info label="Email" value={selected.email} />
                <Info label="Phone" value={selected.phone} />
                <div className="flex gap-2">
                  <StatusBadge type="verification" status={selected.verification_status} />
                  {selected.is_suspended && (
                    <span className="text-xs text-destructive font-medium">Suspended</span>
                  )}
                </div>
                <Button
                  variant={selected.is_suspended ? "default" : "destructive"}
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => toggleSuspend(selected.user_id)}
                >
                  {selected.is_suspended ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> Reactivate Account
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4" /> Suspend Account
                    </>
                  )}
                </Button>
                <div className="pt-4">
                  <p className="font-medium mb-2">Rental History (booking)</p>
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-xs">No bookings</p>
                  ) : (
                    <ul className="space-y-2">
                      {history.map((b) => (
                        <li
                          key={b.booking_id}
                          className="rounded-md border p-2 text-xs"
                        >
                          #{b.booking_id} · {b.vehicle?.plateNumber} ·{" "}
                          <StatusBadge type="booking" status={b.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}
