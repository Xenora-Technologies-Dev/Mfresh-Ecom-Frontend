"use client";

import Link from "next/link";
import { LogIn, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoginModalStore } from "@/components/auth/login-modal";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  title?: string;
  description?: string;
}

export function LoginRequiredModal({
  open,
  onClose,
  onLoginClick,
  title = "Login required",
  description = "Please log in or create a buyer account to add products to your cart.",
}: LoginRequiredModalProps) {
  const openLoginModal = useLoginModalStore((s) => s.openModal);

  if (!open) return null;

  const handleLogin = () => {
    onClose();
    if (onLoginClick) {
      onLoginClick();
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="login-required-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="login-required-title"
            className="text-xl font-bold text-dark-gray"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-light-gray"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted">{description}</p>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" className="w-full gap-2" onClick={handleLogin}>
            <LogIn className="h-4 w-4" />
            Login
          </Button>
          <Button size="lg" variant="outline" className="w-full gap-2" asChild>
            <Link href="/sign-up?role=buyer" onClick={onClose}>
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Continue browsing
          </Button>
        </div>
      </div>
    </div>
  );
}
