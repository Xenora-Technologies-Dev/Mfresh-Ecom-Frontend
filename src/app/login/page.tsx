"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { getDashboardPath, parsePortalRole } from "@/lib/auth/roles";

function isOnboardingComplete(value: unknown): boolean {
  return value === true || value === "true";
}

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  const role = parsePortalRole(meta.portalRole);
  const onboarded = isOnboardingComplete(meta.onboardingComplete);
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (isAdmin) return;
    if (!onboarded) {
      router.replace("/onboarding");
      return;
    }
    if (role) {
      router.replace(getDashboardPath(role));
    }
  }, [isAdmin, isLoaded, isSignedIn, onboarded, role, router]);

  const showAdminNotice = isLoaded && isSignedIn && isAdmin;

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
            <h2 className="text-2xl font-bold text-dark-gray">Sign in as Buyer or Seller</h2>
            <p className="mt-2 text-sm text-muted">
              Access your buyer or seller dashboard to manage orders and listings.
            </p>
          </div>

          {showAdminNotice ? (
            <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-dark-gray">
                This account is an operations admin account. Please use the operations portal to
                sign in.
              </p>
              <Link
                href={process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3007/login"}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Go to operations portal
              </Link>
            </div>
          ) : (
            <SignIn
              routing="hash"
              signUpUrl="/sign-up"
              forceRedirectUrl="/"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none border border-border",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
            />
          )}

          <p className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign up as Buyer / Seller
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
