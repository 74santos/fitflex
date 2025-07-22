import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/unauthorized")
  }

  return session
}