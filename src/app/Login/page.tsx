"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

   const res = await signIn("credentials", {
  email,
  password,
  redirect: false, 
});

if (res?.error) {
  setError("Invalid email or password");
} else if (res?.ok) {

  const session = await fetch("/api/auth/session").then(r => r.json());

  if (session?.user?.role === "EMPLOYER") {
    window.location.href = "/dashboard/employer";
  } else if (session?.user?.role === "JOBSEEKER") {
    window.location.href = "/dashboard/jobseeker";
  } else {
    window.location.href = "/"; 
  }
}

  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)}>
          <Card className="bg-[#16a34a] text-white">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      name="email"
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      name="password"
                      placeholder="Enter password"
                    />
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer border-white border-1 border-solid hover:bg-white hover:text-black duration-300"
                    >
                      Login
                    </Button>
                    <p className="flex items-center justify-center">Or</p>
                    <Button
                      onClick={() => signIn("google")}
                      variant="outline"
                      type="button"
                      className="w-full cursor-pointer border-white border-1 border-solid hover:bg-white hover:text-black duration-300"
                    >
                      Login with Google
                    </Button>
                    <Button
                      onClick={() => signIn("github")}
                      variant="outline"
                      type="button"
                      className="w-full cursor-pointer border-white border-1 border-solid hover:bg-white hover:text-black duration-300"
                    >
                      Login with GitHub
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?
                  <Link href="/SignUp">
                    <Button variant="link" className="cursor-pointer">
                      SignUp
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
