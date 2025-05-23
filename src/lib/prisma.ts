import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
