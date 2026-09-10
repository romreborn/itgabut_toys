import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "itgabut_admin_session";
const SESSION_DURATION = "7d";

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set. See .env.example.");
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  sub: string;
  email: string;
  name: string;
}

/** Signs an admin session JWT. Edge- and Node-compatible (uses `jose`, not `jsonwebtoken`). */
export async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secretKey());
}

/** Verifies an admin session JWT, returning its payload or null if invalid/expired. */
export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email, name: (payload.name as string) ?? "" };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
