"use server";

import { prisma } from "@/lib";
import { auth } from "@/auth";

export async function createJobAlert(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.jobAlert.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint violation (already created alert)
      return { success: false, message: "You already created an alert for this job." };
    }
    throw error;
  }
}
