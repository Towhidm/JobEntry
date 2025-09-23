

"use server"
import { prisma } from "@/lib";
import bcrypt from "bcryptjs";

export async function resetPassword(form:FormData) {
   const token = form.get("token") as string;
  const newPassword = form.get("newPassword") as string;
  const confirmPassword = form.get("confirmPassword") as string;

  if (!token || !newPassword) {
    return { success: false, message: "Missing token or password" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) return  { success: false, message: "Invalid password" }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: record.identifier },
    data: { password: hashedPassword },
  });
  

  // delete the token
  await prisma.verificationToken.delete({ where: { token } });
  
 return { success: true, message: "Password has set successfully" }
}
