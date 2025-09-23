"use server"
import { prisma } from "@/lib";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export async function requestPasswordReset(formdata:FormData) {
  const email = formdata.get("email") as string
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return  { success: false, message: "No account found with this email" } ;

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });
   const resetUrl = `${process.env.NEXTAUTH_URL}/ResetPassword?token=${token}`;

    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hi ${user.name || "there"},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color: blue;">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  });

  console.log(`Password reset email sent to ${email}`);

 return { success: true, message: "Reset link sent to your email" }
 
}
