import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { SessionPayload, SessionUser } from "@/lib/types/auth";

const SESSION_COOKIE_NAME = "entlassungsbrief_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET fehlt. Bitte in .env.local setzen.");
  }
  return secret;
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(content: string) {
  return createHmac("sha256", getSecret()).update(content).digest("base64url");
}

export function createSignedSessionToken(user: SessionUser) {
  const payload: SessionPayload = { user };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function parseSignedSessionToken(token: string): SessionPayload | null {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return null;

  const expected = sign(payloadEncoded);
  if (signature !== expected) return null;

  try {
    return JSON.parse(base64UrlDecode(payloadEncoded)) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = parseSignedSessionToken(token);
  return payload?.user ?? null;
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  const token = createSignedSessionToken(user);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
