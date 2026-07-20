"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { Building2, Mail, Lock, User, Phone, ShoppingBag, Store, ArrowRight } from "lucide-react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { CountrySelect } from "@/components/auth/country-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { parsePortalRole, type SignupPortalRole } from "@/lib/auth/roles";

const roles: {
  id: SignupPortalRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    id: "buyer",
    title: "Buyer",
    description: "Source products and manage procurement.",
    icon: ShoppingBag,
    accent: "border-primary/30 bg-primary/5 text-primary ring-primary/20",
  },
  {
    id: "seller",
    title: "Seller",
    description: "List products and grow your supply business.",
    icon: Store,
    accent: "border-secondary/30 bg-secondary/5 text-secondary ring-secondary/20",
  },
];

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();

  const preselectedRole = parsePortalRole(searchParams.get("role"));

  const [portalRole, setPortalRole] = useState<SignupPortalRole>(
    preselectedRole && preselectedRole !== "admin" ? preselectedRole : "buyer",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");

  const loading = fetchStatus === "fetching";

  const splitName = (full: string) => {
    const parts = full.trim().split(/\s+/);
    return {
      firstName: parts[0] || "User",
      lastName: parts.slice(1).join(" ") || undefined,
    };
  };

  const finishSignUp = async () => {
    if (signUp.status !== "complete") {
      setError("Sign up is not complete yet. Please verify your email.");
      return;
    }

    const { error: finalizeError } = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/onboarding");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });

    if (finalizeError) {
      setError(finalizeError.message || "Could not activate your session.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!organizationName.trim()) {
      setError("Organization name is required.");
      return;
    }
    if (!country.trim()) {
      setError("Country is required.");
      return;
    }

    const { firstName, lastName } = splitName(name);

    const { error: createError } = await signUp.password({
      emailAddress: email.trim(),
      password,
      firstName,
      lastName,
      unsafeMetadata: {
        portalRole,
        organizationName: organizationName.trim(),
        country: country.trim(),
        whatsapp: whatsapp.trim(),
      },
    });

    if (createError) {
      setError(createError.message || "Sign up failed. Please try again.");
      return;
    }

    if (signUp.status === "complete") {
      await finishSignUp();
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.message || "Could not send verification code.");
      return;
    }

    setPendingVerification(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (verifyError) {
      setError(verifyError.message || "Invalid verification code.");
      return;
    }

    await finishSignUp();
  };

  if (signUp.status === "complete" || isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const fieldError =
    errors.fields.emailAddress?.message ||
    errors.fields.password?.message ||
    errors.fields.code?.message ||
    error;

  const needsEmailCode =
    pendingVerification ||
    (signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address"));

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="inline-block rounded-xl bg-white p-2 shadow-sm ring-1 ring-border">
              <Image src="/logo.png" alt="MFresh" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark-gray">
              {needsEmailCode ? "Verify your email" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {needsEmailCode
                ? "Enter the code we sent to your email to finish signing up."
                : "Sign up as a buyer to source products, or a seller to list your catalog."}
            </p>
          </div>

          {needsEmailCode ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              {fieldError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{fieldError}</p>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Verifying..." : "Verify and continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                type="button"
                className="w-full text-center text-xs text-primary hover:underline"
                onClick={() => void signUp.verifications.sendEmailCode()}
              >
                Resend code
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setPortalRole(role.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                      portalRole === role.id
                        ? cn(role.accent, "ring-2")
                        : "border-border bg-white text-muted hover:border-primary/20",
                    )}
                  >
                    <role.icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{role.title}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="organizationName">Organization name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="organizationName"
                    placeholder="Your company name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Country</Label>
                <CountrySelect value={country} onChange={setCountry} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">
                  WhatsApp number <span className="font-normal text-muted">(optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+971 50 000 0000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {/* Clerk bot protection widget mount point */}
              <div id="clerk-captcha" />

              {fieldError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{fieldError}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
