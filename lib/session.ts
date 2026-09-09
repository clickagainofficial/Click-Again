/**
 * Tiny signed-cookie session for the single admin user.
 *
 * The cookie carries `{email, exp}` plus an HMAC-SHA256 signature made with
 * AUTH_SECRET. Nothing sensitive is stored in it, and a tampered or expired
 * cookie fails verification. Everything here uses Web Crypto so the same
 * code runs in middleware (edge) and in route handlers (node).
 */

export const SESSION_COOKIE = "ca_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // one week

type SessionPayload = {
  email: string;
  exp: number;
};

function b64urlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

export async function createSession(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };

  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret()),
    new TextEncoder().encode(body)
  );

  return {
    token: `${body}.${b64urlEncode(new Uint8Array(signature))}`,
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function readSession(token: string | undefined) {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret()),
      b64urlDecode(signature) as unknown as BufferSource,
      new TextEncoder().encode(body)
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(body))
    ) as SessionPayload;

    if (!payload?.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/** Length-independent comparison, so a wrong password leaks no timing hints. */
export function safeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}
