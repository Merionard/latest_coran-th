// Disable TypeScript to avoid troubles with `global.` and avoid vscode import troubles
// @ts-nocheck
import { PrismaClient } from "@prisma/client";
export const prisma: PrismaClient =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
