import { ConditionalChrome } from "@/components/layout/conditional-chrome";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ConditionalChrome>{children}</ConditionalChrome>
    </div>
  );
}
