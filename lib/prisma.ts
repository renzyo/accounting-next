import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismadb?: PrismaClient };

const prismadb =
  globalForPrisma.prismadb ||
  new PrismaClient({
    log: ["info", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismadb = prismadb;

export default prismadb;
