import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Clock,
  Award,
  Gauge,
  Star,
  ChevronRight,
} from "lucide-react";
import { SearchHero } from "@/components/customer/search-hero";
import { StatsBar } from "@/components/customer/stats-bar";
import { VehicleCard } from "@/components/customer/vehicle-card";
import { CtaButton } from "@/components/customer/cta-button";
import { getCustomerVehicles } from "@/lib/customer-vehicles";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const whyUs = [
  { icon: Shield, title: "Fully Insured", desc: "Comprehensive coverage on every rental", color: "bg-blue-500/10 text-blue-600" },
  { icon: Clock, title: "24/7 Support", desc: "Roadside assistance whenever you need", color: "bg-emerald-500/10 text-emerald-600" },
  { icon: Award, title: "Premium Fleet", desc: "Luxury and economy vehicles maintained to standard", color: "bg-cta/10 text-cta" },
  { icon: Gauge, title: "Best Rates", desc: "Transparent pricing with no hidden fees", color: "bg-amber-500/10 text-amber-600" },
];

const reviews = [
  { name: "Sarah Mitchell", role: "Business Traveler", text: "iDriveCDO made my business trips effortless. Always clean cars and on time.", initials: "SM", rating: 5 },
  { name: "David Chen", role: "Family Vacation", text: "Rented an SUV for our family trip. Smooth booking and great customer service.", initials: "DC", rating: 5 },
  { name: "Maria Lopez", role: "Weekend Getaway", text: "Love the app! Booked a convertible in minutes. Will definitely use again.", initials: "ML", rating: 5 },
];

export default function LandingPage() {
  const featured = getCustomerVehicles().filter((v) => v.tag !== "Reserved").slice(0, 3);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0f]">
        <Image
          src="/hero-showroom.jpg"
          alt="Luxury car in showroom"
          fill
          className="object-cover object-[72%_center] opacity-95"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="w-full max-w-xl space-y-6 lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              124 vehicles available now
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Drive Your Dream.
              <br />
              <span className="text-cta">Book in Minutes.</span>
            </h1>
            <p className="text-base text-white/80 max-w-lg sm:text-lg">
              Premium fleet, seamless booking, transparent pricing. From sedans to luxury SUVs — your perfect ride awaits.
            </p>
            <div className="pt-2">
              <SearchHero />
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      <section className="py-14 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <p className="section-label">Our Fleet</p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1">
                Featured Vehicles
              </h2>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center text-sm font-semibold text-cta hover:underline"
            >
              View all <ChevronRight className="h-4 w-4 ml-0.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v.vehicle_id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-14 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">Why Us</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1 mb-12">
            Why Choose iDriveCDO
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <Card key={item.title} className="rounded-2xl border-0 shadow-soft">
                <CardContent className="pt-8 pb-8 px-6">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label">Reviews</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl mt-1 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.name} className="rounded-2xl border-0 shadow-soft text-left">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-cta/10 text-cta text-xs font-semibold">
                        {r.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cta py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                Mobile App
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                Book on the Go with Our App
              </h2>
              <p className="text-white/80 max-w-md">
                Download the iDriveCDO app for mobile browsing, instant reservations, and digital keys.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <CtaButton className="!bg-transparent !text-white border-2 border-white hover:!bg-white/10 !rounded-full">
                  App Store
                </CtaButton>
                <CtaButton className="!bg-transparent !text-white border-2 border-white hover:!bg-white/10 !rounded-full">
                  Google Play
                </CtaButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "50K+", label: "App Downloads" },
                { value: "4.9★", label: "App Rating" },
                { value: "99%", label: "Satisfaction" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md"
                >
                  <p className="text-2xl font-bold sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-sm text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
