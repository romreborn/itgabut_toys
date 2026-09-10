import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/admin") ? sp.next : "/admin";

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form
        action={loginAction}
        style={{
          width: 340,
          maxWidth: "100%",
          background: "#fff",
          border: "2px solid #2E1A10",
          borderRadius: 18,
          padding: 28,
          boxShadow: "5px 5px 0 #2E1A10",
        }}
      >
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Admin Login</h1>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8A7263" }}>ITGabut Toys — internal panel</p>

        {sp.error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 12px",
              border: "2px solid #C9490F",
              borderRadius: 10,
              background: "#FFE7D6",
              color: "#C9490F",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Email atau password salah.
          </div>
        )}

        <input type="hidden" name="next" value={next} />

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Email</label>
        <input
          type="email"
          name="email"
          required
          autoFocus
          style={{
            width: "100%",
            padding: 11,
            border: "2px solid #2E1A10",
            borderRadius: 10,
            marginBottom: 16,
            fontSize: 14,
          }}
        />

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Password</label>
        <input
          type="password"
          name="password"
          required
          style={{
            width: "100%",
            padding: 11,
            border: "2px solid #2E1A10",
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            border: "2px solid #2E1A10",
            borderRadius: 12,
            background: "#EE6A26",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "3px 3px 0 #2E1A10",
          }}
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
