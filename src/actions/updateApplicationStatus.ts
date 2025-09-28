"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib"
import { redirect } from "next/navigation"

export async function updateApplicationStatus(formData: FormData) {
  const session = await auth()
  const user = session?.user
  if (!user || user.role !== "EMPLOYER") redirect("/")

  const appId = formData.get("appId") as string
  const status = formData.get("status") as "APPROVED" | "REJECTED"

  await prisma.application.update({
    where: { id: appId },
    data: { status },
  })

  redirect("/dashboard/employer/applications")
}
