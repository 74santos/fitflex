import { ZodError } from "zod";

export function formatError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors.map(e => e.message).join(", ");
  }

  // Duck-type Prisma unique constraint error
  const err = error as { code?: string; meta?: { target?: string[] } };
  if (err?.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "field";
    return `A user with this ${field} already exists.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
}
