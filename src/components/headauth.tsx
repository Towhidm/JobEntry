"use client";

import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";

const HeadAuth = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!session?.user) {
    return (
      <>
        <Link href="/login">
          <Button
            className="text-[18px] cursor-pointer hover:bg-[#34d399] duration-300"
            variant="ghost"
          >
            LogIn
          </Button>
        </Link>
        <Link href="/SignUp">
          <Button className="text-[18px] bg-[#34d399] cursor-pointer">
            SignUp
          </Button>
        </Link>
      </>
    );
  }

  // Ensure role exists
  const role = session.user.role as Role | undefined;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <>
      <Button
        className="text-[18px] bg-[#34d399] cursor-pointer px-3"
        type="button"
        onClick={handleLogout}
      >
        Signout
      </Button>

      {role && (
        <Link href={`/dashboard/${role.toLowerCase()}`}>
          <Button className="text-[18px] bg-[#34d399] cursor-pointer">
            Profile
          </Button>
        </Link>
      )}
    </>
  );
};

export default HeadAuth;
