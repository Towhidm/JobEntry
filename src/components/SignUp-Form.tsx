"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import SignUpActions from "@/actions/signupform";
import { useActionState } from "react";
import Link from "next/link";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formstate, actions] = useActionState(SignUpActions, { errors: {} });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#16a34a] text-white">
        <CardHeader>
          <CardTitle>SignUP</CardTitle>
          <CardDescription>
            Enter your Information below to SignUp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={actions}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name..."
                />
                {formstate.errors.name && (
                  <p className="text-sm text-red-600">
                    {formstate.errors.name}
                  </p>
                )}
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                {formstate.errors.email && (
                  <p className="text-sm text-red-600">
                    {formstate.errors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/ForgotPassword"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="set your password"
                />
              </div>
              {formstate.errors.password && (
                <p className="text-sm text-red-600">
                  {formstate.errors.password}
                </p>
              )}
              <RadioGroup defaultValue="jobseeker" name="role">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="employer" id="r1" />
                  <Label htmlFor="r1">Employer </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="jobseeker" id="r2" />
                  <Label htmlFor="r2">Jobseeker</Label>
                </div>
              </RadioGroup>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full cursor-pointer  border-white border-1 border-solid hover:bg-white hover:text-black duration-300"
                >
                  SignUp
                </Button>
                {formstate.errors.formerror && (
                  <p className="text-sm text-red-600">
                    {formstate.errors.formerror}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full cursor-pointer border-1 border-solid hover:bg-white hover:text-black duration-300"
                >
                  Login with Google Or Github
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?
              <Link href="/Login">
                <Button variant="link" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
