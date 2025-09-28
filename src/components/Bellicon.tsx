import { Bell } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib";

export default async function Bellicon() {
  const session = await auth();
  let alertsCount = 0;

  if (session?.user?.id) {
    alertsCount = await prisma.jobAlert.count({
      where: { userId: session.user.id },
    });
  }

  return (
    <Link href="/Alert" className="relative">
      <Bell className="w-6 h-6 text-gray-700 hover:text-green-600" />
      {alertsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {alertsCount}
        </span>
      )}
    </Link>
  );
}
