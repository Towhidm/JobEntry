"use server";

import { prisma } from "@/lib";
import { auth } from "@/auth";

export async function createJobAlert(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if the job alert already exists
    const existingAlert = await prisma.jobAlert.findFirst({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    if (existingAlert) {
      return {
        success: false,
        message: "You already created an alert for this job.",
      };
    }
    await prisma.jobAlert.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}
