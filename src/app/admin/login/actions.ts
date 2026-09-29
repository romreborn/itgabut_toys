"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { signAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { clientIp, lockRemainingSeconds, registerFailure, clearAttempts } from "@/lib/loginThrottle";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "/admin");
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin";

  if (!email || !password) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  // Throttle per IP rather than per email: an attacker hammering the form gets
  // locked out, but can't lock the real owner out of their own panel.
  const identifier = `ip:${await clientIp()}`;
  const locked = await lockRemainingSeconds(identifier);
  if (locked > 0) {
    const wait = Math.ceil(locked / 60);
    redirect(`/admin/login?error=locked&wait=${wait}&next=${encodeURIComponent(next)}`);
  }

  const { data: admin } = await supabaseAdmin
    .from("admin_users")
    .select("id,email,name,passwordHash")
    .eq("email", email)
    .maybeSingle();

  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!admin || !valid) {
    await registerFailure(identifier);
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  await clearAttempts(identifier);

  const token = await signAdminSession({ sub: admin.id, email: admin.email, name: admin.name });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
