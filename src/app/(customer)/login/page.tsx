import { Card, CardHeader } from "@/components/ui/card";
import { BrilliantGemLogo } from "@/components/brand/brilliant-gem-logo";
import { LoginForm } from "@/components/customer/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-0 shadow-soft">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <BrilliantGemLogo size="lg" />
          </div>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}
