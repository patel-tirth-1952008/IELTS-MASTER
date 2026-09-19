import { PrismaClient } from "@prisma/client";

// PrismaClient singleton — prevents exhausting Neon connections during
// Next.js dev hot-reloads. One client per server process.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__ieltsPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__ieltsPrisma = prisma;
}

export default prisma;
