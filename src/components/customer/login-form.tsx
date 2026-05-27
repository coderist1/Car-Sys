"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/customer/cta-button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authenticate, DEMO_ACCOUNTS, registerCustomer } from "@/lib/auth/mock-auth";
import { getPostLoginPath, getSession, setSession } from "@/lib/auth/session";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      router.replace(getPostLoginPath(existing));
    }
  }, [router]);

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = authenticate(email, password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSession(result.session);
    router.push(getPostLoginPath(result.session));
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = registerCustomer({ email, password, fullName });
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSession(result.session);
    router.push(getPostLoginPath(result.session));
    router.refresh();
  }

  return (
    <CardContent className="space-y-4">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="login" className="rounded-lg">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="rounded-lg">
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                className="h-11 rounded-xl"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className="h-11 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <CtaButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </CtaButton>
          </form>
        </TabsContent>

        <TabsContent value="register" className="mt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">Full name</Label>
              <Input
                id="reg-name"
                className="h-11 rounded-xl"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                className="h-11 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                className="h-11 rounded-xl"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {error && (
              <p
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
            <CtaButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </CtaButton>
          </form>
        </TabsContent>
      </Tabs>

      <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Demo accounts</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account)}
              className="rounded-full border border-cta/30 bg-white px-3 py-1 text-xs font-medium text-cta hover:bg-cta/5 transition"
            >
              Use {account.label}
            </button>
          ))}
        </div>
        <p>
          Customer password: <code className="text-foreground">customer123</code>
          <br />
          Admin/staff/driver password: <code className="text-foreground">admin123</code>
        </p>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="text-cta hover:underline">
          Back to home
        </Link>
      </p>
    </CardContent>
  );
}
