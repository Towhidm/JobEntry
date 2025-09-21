"use server";
import * as auth from "@/auth";
import { redirect } from "next/navigation";

export async function SignOut(options?: { redirect?: boolean }) {
  await auth.signOut(); // NextAuth signOut
  if (options?.redirect ?? true) {
    redirect("/"); // default redirect
  }
}
