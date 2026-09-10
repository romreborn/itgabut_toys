"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { signAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "/admin");
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin";

  if (!email || !password) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const { data: admin } = await supabaseAdmin
    .from("admin_users")
    .select("id,email,name,passwordHash")
    .eq("email", email)
    .maybeSingle();

  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!admin || !valid) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

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
