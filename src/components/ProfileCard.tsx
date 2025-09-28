"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ProfileCardProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "EMPLOYER" | "JOBSEEKER";
  children: React.ReactNode;
};

export default function ProfileCard({
  name,
  email,
  image,
  role,
  children,
}: ProfileCardProps) {
  return (
    <Card className="shadow-lg border-[#22c55e] border-2 bg-[#f5f5f5] rounded-2xl">
      <CardHeader className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image || ""} />
          <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{name || "No Name"}</CardTitle>
          <p className="text-sm text-gray-500">{email}</p>
          <Badge variant="secondary" className="mt-2">
            {role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
