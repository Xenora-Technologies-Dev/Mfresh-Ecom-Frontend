"use client";

import { create } from "zustand";
import Link from "next/link";
import { X } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

interface LoginModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));

export function LoginModal() {
  const open = useLoginModalStore((s) => s.open);
  const closeModal = useLoginModalStore((s) => s.closeModal);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[135] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={closeModal}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="login-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="login-modal-title" className="text-lg font-bold text-dark-gray">
            Log in to MFresh
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-1.5 text-muted hover:bg-light-gray"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none border-none p-0",
                footer: "hidden",
              },
            }}
          />
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up?role=buyer"
            onClick={closeModal}
            className="font-semibold text-primary hover:underline"
          >
            Sign up as Buyer
          </Link>
          {" / "}
          <Link
            href="/sign-up?role=seller"
            onClick={closeModal}
            className="font-semibold text-secondary hover:underline"
          >
            Sign up as Seller
          </Link>
        </p>
      </div>
    </div>
  );
}
