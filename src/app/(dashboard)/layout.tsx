"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, useUser, UserButton, useClerk } from "@clerk/nextjs";
import { LayoutDashboard, ClipboardList, LogOut } from "lucide-react";
import { getDashboardPath, parsePortalRole, type PortalRole } from "@/lib/auth/roles";

function isOnboardingComplete(value: unknown): boolean {
  return value === true || value === "true";
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fresh-mint">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function DashboardSidebar({ role }: { role: PortalRole }) {
  const dashboardHref = getDashboardPath(role);
  const links = [
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "My enquiries", href: `${dashboardHref}#enquiries`, icon: ClipboardList },
  ];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-white/60 px-3 py-6 sm:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-dark-gray transition-colors hover:bg-primary/5 hover:text-primary"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  const role = parsePortalRole(meta.portalRole);
  const onboarded = isOnboardingComplete(meta.onboardingComplete);
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      router.replace("/login");
    }
  }, [authLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!authLoaded || !isSignedIn || !userLoaded) return;
    if (isAdmin) {
      window.location.href = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3007";
      return;
    }
    if (!role || !onboarded) {
      router.replace("/onboarding");
    }
  }, [authLoaded, isAdmin, isSignedIn, onboarded, role, router, userLoaded]);

  if (!authLoaded || !isSignedIn) return <LoadingScreen />;
  if (!userLoaded || isAdmin || !role || !onboarded) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-fresh-mint">
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MFresh" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium capitalize text-muted sm:inline">
              {role === "seller" ? "Seller" : "Buyer"} workspace
            </span>
            <UserButton />
            <button
              type="button"
              onClick={() => void signOut({ redirectUrl: "/" })}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-dark-gray transition-colors hover:bg-light-gray hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar role={role} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
