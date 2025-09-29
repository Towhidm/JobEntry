/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Your type declarations go here...
declare module "next-auth" {
  interface Session {
    user: {
      role: Role | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role | null;
  }
}