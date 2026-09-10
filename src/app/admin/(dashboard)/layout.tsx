import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminSession";
import { logoutAction } from "../login/actions";

/**
 * Defense-in-depth: `middleware.ts` already redirects unauthenticated
 * requests before they ever reach this layout, but re-checking here means a
 * misconfigured matcher can't silently leave a route unprotected.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSession(token) : null;
  if (!session) redirect("/admin/login");

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          padding: "14px 24px",
          borderBottom: "2px solid #2E1A10",
          background: "#fff",
        }}
      >
        <Link href="/admin/products" style={{ fontWeight: 800, fontSize: 16, color: "#2E1A10" }}>
          ITGabut Admin
        </Link>
        <nav style={{ display: "flex", gap: 4 }}>
          <Link href="/admin/products" style={{ padding: "8px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#2E1A10" }}>
            Produk
          </Link>
          <Link href="/admin/blog" style={{ padding: "8px 12px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#2E1A10" }}>
            Blog
          </Link>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "#8A7263" }}>{session.email}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              style={{
                padding: "7px 12px",
                border: "2px solid #2E1A10",
                borderRadius: 9,
                background: "#fff",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
