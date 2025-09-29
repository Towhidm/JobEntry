"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export async function saveApplication(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "JOBSEEKER") redirect("/");

  const jobId = formData.get("jobId") as string;
  const cvFile = formData.get("cv") as File;
  const coverLetter = formData.get("coverLetter") as string;

  const buffer = Buffer.from(await cvFile.arrayBuffer());
  const timestamp = Date.now();
  const fileName = `${timestamp}-${cvFile.name}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("cv-uploads")
    .upload(fileName, buffer, { contentType: cvFile.type });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("cv-uploads").getPublicUrl(fileName);

  const publicUrl = data.publicUrl;

  // Save to DB
  await prisma.application.create({
    data: {
      userId: user.id as string,
      jobId,
      cv: publicUrl,
      coverLetter,
    },
  });

  redirect("/dashboard/employer/JobBoard");
}
