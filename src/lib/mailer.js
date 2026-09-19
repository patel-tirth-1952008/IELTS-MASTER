// ── Transactional email ─────────────────────────────────────
// Works out of the box with Resend (set RESEND_API_KEY + MAIL_FROM).
// With no provider configured the message is logged to the server
// console so local development still works end-to-end.

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM ?? "IELTS Master <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function emailTemplate({ heading, intro, code, cta, footer }) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#FCF9F2;font-family:Inter,Arial,sans-serif;color:#1e293b">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #EBE3D5;border-radius:16px;padding:32px">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#D97706">IELTS Master</p>
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:800">${heading}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569">${intro}</p>
      ${code ? `<div style="margin:0 0 20px;padding:16px;border:1px dashed #EBE3D5;border-radius:12px;background:#FEF3C7;text-align:center">
        <span style="font-size:32px;font-weight:800;letter-spacing:.32em;color:#B45309">${code}</span>
      </div>` : ""}
      ${cta ? `<p style="margin:0 0 20px"><a href="${cta.href}" style="display:inline-block;background:#F59E0B;color:#0f172a;font-weight:700;padding:12px 20px;border-radius:12px;text-decoration:none">${cta.label}</a></p>` : ""}
      <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b">${footer ?? "If you didn't request this, you can safely ignore this email."}</p>
    </div>
    <p style="max-width:520px;margin:16px auto 0;font-size:12px;color:#94a3b8;text-align:center">Sent by IELTS Master · ${SITE.replace(/^https?:\/\//, "")}</p>
  </body></html>`;
}

/**
 * Send one email. Never throws — callers treat delivery as best-effort.
 * @returns {Promise<{delivered:boolean, provider:string, error?:string}>}
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_KEY) {
    console.log(
      `\n[mailer:dev] no RESEND_API_KEY set — email not sent.\n  to: ${to}\n  subject: ${subject}\n  body: ${(text ?? html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)}\n`
    );
    return { delivered: false, provider: "console" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[mailer] resend error", res.status, detail.slice(0, 200));
      return { delivered: false, provider: "resend", error: `HTTP ${res.status}` };
    }
    return { delivered: true, provider: "resend" };
  } catch (err) {
    console.error("[mailer]", err?.message ?? err);
    return { delivered: false, provider: "resend", error: "network" };
  }
}

export function sendVerificationEmail(to, code, name = "") {
  return sendEmail({
    to,
    subject: `${code} is your IELTS Master verification code`,
    text: `Hi${name ? ` ${name}` : ""}, your verification code is ${code}. It expires in 15 minutes.`,
    html: emailTemplate({
      heading: "Verify your email",
      intro: `Hi${name ? ` ${name}` : ""}, welcome to IELTS Master. Enter this code to activate your account — it expires in 15 minutes.`,
      code,
      footer: "If you didn't create an account, no action is needed.",
    }),
  });
}

export function sendPasswordResetEmail(to, code, name = "") {
  return sendEmail({
    to,
    subject: `${code} is your IELTS Master password reset code`,
    text: `Hi${name ? ` ${name}` : ""}, your password reset code is ${code}. It expires in 20 minutes.`,
    html: emailTemplate({
      heading: "Reset your password",
      intro: `Hi${name ? ` ${name}` : ""}, use this code to choose a new password. It expires in 20 minutes and can be used once.`,
      code,
      footer: "Didn't ask for this? Someone may have typed your email by mistake — you can ignore it, your password is unchanged.",
    }),
  });
}

export function sendTwoFactorEmail(to, code) {
  return sendEmail({
    to,
    subject: `${code} is your IELTS Master sign-in code`,
    text: `Your two-factor sign-in code is ${code}. It expires in 10 minutes.`,
    html: emailTemplate({
      heading: "Two-factor sign-in",
      intro: "Enter this code to finish signing in. It expires in 10 minutes.",
      code,
      footer: "If this wasn't you, change your password immediately and enable a new 2FA code.",
    }),
  });
}
