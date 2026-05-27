"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";

const activityLogs = [
  { action: "Updated vehicle FPX-2847 status", time: "2 hours ago" },
  { action: "Approved booking #1003 payment", time: "5 hours ago" },
  { action: "Scheduled maintenance for FPX-8873", time: "Yesterday" },
  { action: "Signed in from new device", time: "2 days ago" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Profile"
        description="Admin staff profile via staff_info extending user."
      />

      <Card className="border-border/60">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  AR
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                <Upload className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">Alex Rivera</h2>
              <p className="text-sm text-muted-foreground">admin@fleetpro.io</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Administrator</Badge>
                <Badge variant="outline">Operations</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Editable Information</CardTitle>
          <CardDescription>staff_info fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Alex Rivera" />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input defaultValue="Operations" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="+1 (555) 100-0001" />
            </div>
            <div className="space-y-2">
              <Label>Hire Date</Label>
              <HydrationDateInput defaultValue="2023-01-15" />
            </div>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              "Manage vehicles & fleet",
              "Create & edit bookings",
              "Process payments",
              "Assign drivers",
              "Schedule maintenance",
              "Manage customer accounts",
              "Export records",
              "System settings",
            ].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityLogs.map((log, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm">
                <span>{log.action}</span>
                <span className="text-muted-foreground text-xs">{log.time}</span>
              </div>
              {i < activityLogs.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
