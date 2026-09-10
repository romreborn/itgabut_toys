import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FBF3E7", color: "#2E1A10", fontFamily: "system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
