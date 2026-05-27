"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        description="System configuration, roles, notifications, and security."
      />

      <Tabs defaultValue="system">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>FleetPro rental management defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input defaultValue="FleetPro Rentals" />
              </div>
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>User Role Management</CardTitle>
              <CardDescription>Maps to user.role — admin, manager, staff, customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { role: "admin", desc: "Full system access" },
                { role: "manager", desc: "Fleet & booking management" },
                { role: "staff", desc: "Customer service & records" },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium capitalize">{r.role}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <Switch defaultChecked={r.role !== "staff"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "New booking alerts",
                "Maintenance due reminders",
                "Payment received",
                "Driver assignment updates",
              ].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <Label>{n}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Two-factor authentication</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Session timeout (30 min)</Label>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Database snapshot controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Last backup: May 26, 2026 · 02:00 AM</p>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Button>Create Backup</Button>
                <Button variant="outline">Restore</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
