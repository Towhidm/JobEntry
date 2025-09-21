"use server";
import { prisma } from "@/lib";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner"

const CreateSignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  role: z
    .enum(["employer", "jobseeker"])
    .transform((val) => val.toUpperCase() as "EMPLOYER" | "JOBSEEKER"),
});
type CreateSignUPFormState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    formerror?: string[];
  };
};
const SignUpActions = async (
  prevState: CreateSignUPFormState,
  formdata: FormData
): Promise<CreateSignUPFormState> => {
  const result = CreateSignUpSchema.safeParse({
    name: formdata.get("name"),
    email: formdata.get("email"),
    password: formdata.get("password"),
    role: formdata.get("role"),
  });
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        role: result.data.role,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          formerror: [err.message],
        },
      };
    } else {
      return {
        errors: {
          formerror: ["Somthing went wrong"],
        },
      };
    }
  }
  
  redirect("/");
};
export default SignUpActions;
