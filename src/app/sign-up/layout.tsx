import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a buyer or seller account on MFresh.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
