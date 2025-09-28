import { auth } from "@/auth";
import { prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ activeJobs: 0, totalApplications: 0 });
  }

  // 1️⃣ Count active jobs for this employer
  const activeJobs = await prisma.job.count({
    where: {
      createdById: session.user.id,
      status: "ACTIVE",
    },
  });

  // 2️⃣ Count applications for all their jobs
  const totalApplications = await prisma.application.count({
    where: {
      job: { createdById: session.user.id },
    },
  });

  return NextResponse.json({ activeJobs, totalApplications });
}
