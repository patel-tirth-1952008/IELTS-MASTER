import { prisma } from "@/lib/prisma";

// ── Row-Level Security helpers ──────────────────────────────
// These make Postgres itself enforce tenant isolation (see prisma/rls.sql).
// Every query inside the callback runs in a transaction where
// current_setting('app.user_id') is the signed-in user, so a missing
// `where: { userId }` in application code can no longer leak rows.
//
//   const mine = await withUserContext(userId, (db) =>
//     db.submission.findMany({ where: { examType: "reading" } })
//   );

async function setLocal(tx, key, value) {
  await tx.$queryRaw`SELECT set_config(${key}, ${value}, true)`;
}

/** Run DB work as a specific end user (RLS policies apply). */
export function withUserContext(userId, fn) {
  if (!userId) return Promise.reject(new Error("withUserContext requires a userId"));
  return prisma.$transaction(async (tx) => {
    await setLocal(tx, "app.user_id", String(userId));
    return fn(tx);
  });
}

/** Run DB work as the service role (background jobs, admin reporting). */
export function withServiceContext(fn, { role = "service" } = {}) {
  return prisma.$transaction(async (tx) => {
    await setLocal(tx, "app.role", role);
    return fn(tx);
  });
}

/**
 * Convenience: user-scoped Prisma "where" with a mandatory userId.
 * Throws instead of silently running an unscoped query.
 */
export function ownedBy(userId, where = {}) {
  if (!userId) throw new Error("ownedBy requires a userId");
  return { ...where, userId };
}
