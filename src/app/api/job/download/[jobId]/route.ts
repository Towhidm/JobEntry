import { prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { jobId: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const fileContent = `
    Job Title: ${job.title}
    Description: ${job.description}
    Status: ${job.status}
  `;

  return new Response(fileContent, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${job.title}.txt"`,
    },
  });
}
