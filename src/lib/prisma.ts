import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD
const g = globalThis as any;
export const prisma: PrismaClient = g.prisma ?? new PrismaClient({ log:["error","warn"] });
if (!g.prisma) g.prisma = prisma;
=======
const g = global as any;
export const prisma = g.prisma || new PrismaClient({ log: ['error','warn'] });
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;
>>>>>>> 1e78a84ba37c5432150f9a5c011193a42dc406a5
