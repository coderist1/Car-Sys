import Link from "next/link";
import { Share2, Mail, Phone, MapPin } from "lucide-react";
import { IDriveCDOLogo } from "@/components/brand/idrive-cdo-logo";

export function CustomerFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <IDriveCDOLogo size="md" variant="dark" />
            <p className="text-sm text-muted-foreground">
              Premium car rental with seamless booking. Drive excellence with iDriveCDO.
            </p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Twitter"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-cta hover:text-white text-muted-foreground"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/vehicles" className="hover:text-cta">Browse Vehicles</Link></li>
              <li><Link href="/book" className="hover:text-cta">Book Now</Link></li>
              <li><Link href="/dashboard" className="hover:text-cta">My Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-cta">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>FAQ</li>
              <li>Insurance</li>
              <li>Cancellation Policy</li>
              <li>Live Chat 24/7</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cta shrink-0" /> +1 (800) 555-GEM
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cta shrink-0" /> hello@idrivecdo.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-cta mt-0.5" />
                1200 Harbor Blvd, Miami, FL
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} iDriveCDO Car Rental. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
