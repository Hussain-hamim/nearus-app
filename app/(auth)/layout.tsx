import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="sr-only">
        <Logo />
      </div>
      {children}
    </div>
  );
}
