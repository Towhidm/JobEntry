"use server";

import { prisma } from "@/lib";
import { auth } from "@/auth";

export async function toggleBookmark(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Not logged in" };

  const userId = session.user.id;

  // Check if bookmark exists
  const existing = await prisma.bookmark.findFirst({
    where: { jobId, userId },
  });

  if (existing) {
    // Remove bookmark
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { success: true, bookmarked: false };
  } else {
    // Add bookmark
    await prisma.bookmark.create({
      data: { jobId, userId },
    });
    return { success: true, bookmarked: true };
  }
}
