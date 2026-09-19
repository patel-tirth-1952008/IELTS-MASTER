import { prisma } from "@/lib/prisma";
import { isValidEmail, normalizeEmail, sanitizeText, sanitizeName } from "@/lib/security";
import { withApiGuard, jsonError, jsonOk } from "@/lib/apiGuard";

// Stores contact messages server-side (3 per 15 min per IP, rate limited).
async function handler(req, ctx) {
  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const name = sanitizeName(body.name);
  const email = normalizeEmail(body.email);
  const subject = sanitizeText(body.subject, 120);
  const message = sanitizeText(body.message, 4000);
  // Simple honeypot: bots fill hidden fields, humans never see them.
  if (body.website) return jsonOk({ message: "Thanks!" }, 201);

  if (!name) return jsonError("Please enter your name.", 400);
  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.", 400);
  if (message.trim().length < 10) {
    return jsonError("Please write at least 10 characters.", 400);
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message, ip: ctx?.ip ?? null },
    });
  } catch (err) {
    console.error("[contact]", err?.message ?? err);
    return jsonError("We couldn't save your message right now. Please email us instead.", 503);
  }

  return jsonOk({ message: "Message received — we'll reply within a couple of days." }, 201);
}

export const POST = withApiGuard(handler, "contact");
