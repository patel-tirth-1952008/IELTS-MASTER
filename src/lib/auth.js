import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/security";

// Sessions live ONLY in HTTP-only cookies. Nothing about the session is
// written to localStorage/sessionStorage, so XSS cannot exfiltrate a token.
export const TOKEN_COOKIE = "ielts_token";
export const CSRF_COOKIE = "ielts_csrf";
const TOKEN_DAYS = 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
  }
  return secret;
}

const isProd = () => process.env.NODE_ENV === "production";

// ── Passwords ──────────────────────────────────────────────
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

// ── Tokens ─────────────────────────────────────────────────
// Every JWT carries a token version + CSRF secret. Bumping tokenVersion
// on the user row instantly invalidates all outstanding sessions.
export function signToken({ userId, email, role, tokenVersion = 0, csrf }) {
  return jwt.sign(
    { userId, email, role, v: tokenVersion, csrf: csrf ?? hashToken(generateToken(12)).slice(0, 32) },
    getSecret(),
    { expiresIn: `${TOKEN_DAYS}d`, issuer: "ielts-master", audience: "web" }
  );
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret(), {
      issuer: "ielts-master",
      audience: "web",
    });
  } catch {
    return null; // expired or tampered — never throw to callers
  }
}

// ── Cookies ────────────────────────────────────────────────
export function setAuthCookie(token, csrf = null) {
  const store = cookies();
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_DAYS * 24 * 60 * 60,
  });
  if (csrf) {
    // Readable by JS on purpose: double-submit CSRF token, worthless alone.
    store.set(CSRF_COOKIE, csrf, {
      httpOnly: false,
      secure: isProd(),
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_DAYS * 24 * 60 * 60,
    });
  }
}

export function clearAuthCookie() {
  const store = cookies();
  for (const name of [TOKEN_COOKIE, CSRF_COOKIE]) {
    store.set(name, "", {
      httpOnly: name === TOKEN_COOKIE,
      secure: isProd(),
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

export function getTokenFromCookies() {
  try {
    return cookies().get(TOKEN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

// ── Session resolution ─────────────────────────────────────
/** Fast path: trust the signed JWT only (no DB hit). */
export function getCurrentUser() {
  const decoded = verifyToken(getTokenFromCookies());
  if (!decoded?.userId) return null;
  return {
    userId: decoded.userId,
    email: decoded.email ?? null,
    role: decoded.role ?? "user",
    csrf: decoded.csrf ?? null,
    tokenVersion: decoded.v ?? 0,
  };
}

/**
 * Strict path for protected endpoints: re-reads the user row and rejects
 * revoked tokens, unverified emails, and locked accounts. Also returns the
 * DB row so handlers never have to fetch it twice.
 */
export async function getSessionUser({ requireVerified = false } = {}) {
  const session = getCurrentUser();
  if (!session?.userId) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true, email: true, name: true, role: true, avatar: true,
        targetBand: true, examDate: true, createdAt: true,
        emailVerified: true, twoFactorEnabled: true, tokenVersion: true,
        lockedUntil: true, passwordChangedAt: true, lastLoginAt: true,
      },
    });
    if (!user) return null;
    if ((user.tokenVersion ?? 0) !== (session.tokenVersion ?? 0)) return null; // revoked
    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) return null;
    if (requireVerified && !user.emailVerified) return null;
    return user;
  } catch (err) {
    console.error("[auth:getSessionUser]", err?.message ?? err);
    return null;
  }
}

/**
 * Issue a session: HTTP-only JWT + readable CSRF companion cookie.
 * Call after every successful sign-in / verification.
 */
export async function issueSession(user) {
  const csrf = generateToken(16);
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role ?? "user",
    tokenVersion: user.tokenVersion ?? 0,
    csrf,
  });
  setAuthCookie(token, csrf);
  return { csrf, expiresInDays: TOKEN_DAYS };
}

/** Invalidate every existing session for a user (password change, logout-all). */
export async function revokeAllSessions(userId) {
  if (!userId) return;
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}

// Strip sensitive fields before sending a user row to the client.
export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    targetBand: user.targetBand,
    examDate: user.examDate,
    avatar: user.avatar,
    emailVerified: user.emailVerified ?? false,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
    createdAt: user.createdAt,
  };
}
