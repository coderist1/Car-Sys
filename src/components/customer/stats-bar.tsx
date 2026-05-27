import { Car, CircleCheck, BookOpen, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Car, label: "Total Vehicles", value: "124", color: "bg-blue-500/10 text-blue-600" },
  { icon: CircleCheck, label: "Available Now", value: "87", color: "bg-emerald-500/10 text-emerald-600" },
  { icon: BookOpen, label: "Active Reservations", value: "37", color: "bg-amber-500/10 text-amber-600" },
  { icon: DollarSign, label: "Monthly Revenue", value: "$67K", color: "bg-cta/10 text-cta" },
];

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-8 sm:-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="rounded-2xl border-0 shadow-soft">
              <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${s.color}`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground sm:text-2xl">{s.value}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
