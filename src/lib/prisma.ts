import { PrismaClient } from "@prisma/client";
const g = globalThis as any;
export const prisma: PrismaClient = g.prisma ?? new PrismaClient({ log:["error","warn"] });
if (!g.prisma) g.prisma = prisma;
