"use server"
import { prisma } from "@/lib";
import { JobStatus } from "@prisma/client";
import { auth } from "@/auth";


const PostJobs = async (form:FormData) =>{
    const session = await auth();
     if (!session || !session.user?.id) {
    return { success: false};
  }
    const title = form.get("title") as string;
    const description = form.get("description") as string
    const status = form.get("status") as JobStatus
     await prisma.job.create({
    data: {
      title,
      description,
      status,
      createdById: session.user.id, // 🔑 tie job to user
    },
  });

  return { success: true};

};


export default PostJobs;