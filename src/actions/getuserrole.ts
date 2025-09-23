"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GetUserRole() {
  const session = await auth();

  if (!session?.user) {
    return;}

  // Local type cast to include role
  const user = session.user as { role?: "employer" | "jobseeker" | null };

  if (!user.role) {
    console.log(user);
    redirect("/selectrole"); // new users
  } else if (user.role === "employer") {
    redirect("/dashboard/employer");
  } else if (user.role === "jobseeker") {
    redirect("/dashboard/jobseeker");
  } else {
    redirect("/"); // fallback
  }
}
