import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CheckRolePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as { role?: "EMPLOYER" | "JOBSEEKER" | null };

  if (!user.role) {
    redirect("/selectrole"); // if no role
  }
  else if(user.role === "EMPLOYER"){
    redirect("/dashboard/employer")
  }
  else if(user.role === "JOBSEEKER"){
    redirect("/dashboard/jobseeker")
  }
  else{
    redirect("/");
  }
}
