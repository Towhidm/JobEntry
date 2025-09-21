"use client";

import { Button } from "./ui/button";
import { SignIn } from "@/actions/signIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {signOut} from "next-auth/react"
import Link from "next/link"

const HeadAuth = () => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }
  if (session.data?.user) {
    const handleLogout = async () => {
      await signOut({ redirect: false }); // client-side logout
      router.push("/"); // redirect to home page
    };
    return (
      <Button
        className="text-[18px] bg-[#34d399] cursor-pointer"
        type="submit"
        onClick={handleLogout}
      >
        Signout
      </Button>
    );
  } else {
    return (
      <>
        <Link href ="/Login">
          <Button
            className="text-[18px] cursor-pointer hover:bg-[#34d399] duration-300"
            variant="ghost"
          >
            LogIn
          </Button>
        </Link>
        <Link href="/SignUp">
          <Button
            className="text-[18px] bg-[#34d399] cursor-pointer"
            
          >
            SignUp
          </Button>
        </Link> 

      </>
    );
  }
};
export default HeadAuth;
