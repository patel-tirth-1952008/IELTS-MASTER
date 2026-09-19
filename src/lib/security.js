import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { getClientIp } from "@/lib/rateLimit";

// Input sanitization, password policy, token hashing, account lockout.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email.trim());
}

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

// Escape HTML special chars to prevent stored/reflected XSS.
export function sanitizeText(input, maxLen = 2000) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .slice(0, maxLen);
}

export function sanitizeName(name) {
  return sanitizeText(name, 80).trim();
}

// ── Password policy ────────────────────────────────────────
export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_BYTES = 72; // bcrypt silently ignores bytes past 72

// Breach-style blocklist: the passwords that show up in every credential dump.
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "password1234", "passw0rd",
  "123456", "1234567", "12345678", "123456789", "1234567890", "12345678901",
  "qwerty", "qwerty123", "qwertyuiop", "abc123", "abcd1234", "letmein",
  "welcome", "welcome123", "iloveyou", "admin", "admin123", "administrator",
  "root", "toor", "guest", "user", "test1234", "testtest", "changeme",
  "secret", "master", "monkey", "dragon", "football", "baseball", "princess",
  "sunshine", "superman", "trustno1", "whatever", "starwars", "zaq12wsx",
  "1q2w3e4r", "1qaz2wsx", "asdfghjkl", "asdf1234", "qazwsxedc", "india123",
  "india@123", "ielts", "ielts2024", "ielts123", "ieltsmaster", "ielts@123",
  "study123", "exam123", "mypassword", "newpassword", "temppassword",
]);

/**
 * Enforce a real password policy.
 * @returns {{ok:boolean, score:number, problems:string[], label:string}}
 */
export function validatePasswordStrength(password, { email = "", name = "" } = {}) {
  const pw = String(password ?? "");
  const problems = [];

  if (pw.length < MIN_PASSWORD_LENGTH) {
    problems.push(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (Buffer.byteLength(pw, "utf8") > MAX_PASSWORD_BYTES) {
    problems.push("Password is too long (max 72 bytes).");
  }

  const classes = [
    /[a-z]/.test(pw),
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;
  if (classes < 3 && pw.length < 16) {
    problems.push("Mix upper case, lower case, numbers and a symbol.");
  }

  const lower = pw.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) {
    problems.push("This password appears in known breach lists — pick another.");
  }
  if (/^(.)\1{2,}$/.test(pw) || /(0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(pw)) {
    problems.push("Avoid repeated or sequential characters.");
  }

  const local = String(email).split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) {
    problems.push("Don't include your email address in the password.");
  }
  const namePart = String(name).trim().toLowerCase();
  if (namePart.length >= 4 && lower.includes(namePart)) {
    problems.push("Don't include your name in the password.");
  }

  let score = 0;
  if (pw.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (pw.length >= 14) score += 1;
  if (classes === 4) score += 1;
  if (pw.length >= 12 && classes >= 3 && !/(0123|1234|abcd|qwer|password)/i.test(pw)) score += 1;
  if (problems.some((p) => !p.startsWith("Use at least") && !p.startsWith("Mix"))) score = Math.min(score, 2);

  const label = score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Strong" : "Excellent";
  // Require the length + composition rules (score floor) — no "abc12345" sign-ups.
  const ok =
    pw.length >= MIN_PASSWORD_LENGTH &&
    Buffer.byteLength(pw, "utf8") <= MAX_PASSWORD_BYTES &&
    (classes >= 3 || pw.length >= 16) &&
    !COMMON_PASSWORDS.has(lower) &&
    !/^(.)\1{2,}$/.test(pw);

  return { ok, score, problems, label };
}

// ── One-time codes & tokens ────────────────────────────────
// Codes/tokens are never stored in plain text: only their SHA-256 hash.
export function generateCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function hashToken(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

// ── Account lockout (in-memory) ─────────────────────────────
// Fast first line of defence; the DB-backed counter in the login route
// is the durable one (survives cold starts and works multi-instance).
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

const attempts = new Map(); // email -> { count, lockedUntil }

export function checkAccountLockout(email) {
  const key = normalizeEmail(email);
  const rec = attempts.get(key);
  if (!rec) return { locked: false, remainingAttempts: MAX_ATTEMPTS };
  if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
    const retryInMin = Math.ceil((rec.lockedUntil - Date.now()) / 60000);
    return { locked: true, retryInMin };
  }
  if (rec.lockedUntil && Date.now() >= rec.lockedUntil) {
    attempts.delete(key);
    return { locked: false, remainingAttempts: MAX_ATTEMPTS };
  }
  return { locked: false, remainingAttempts: Math.max(0, MAX_ATTEMPTS - rec.count) };
}

export function recordFailedLogin(email) {
  const key = normalizeEmail(email);
  const rec = attempts.get(key) ?? { count: 0, lockedUntil: null };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = Date.now() + LOCK_MS;
  }
  attempts.set(key, rec);
  return checkAccountLockout(key);
}

export function resetFailedLogin(email) {
  attempts.delete(normalizeEmail(email));
}

export const LOCKOUT_LIMITS = { MAX_ATTEMPTS, LOCK_MS };

export { getClientIp };
