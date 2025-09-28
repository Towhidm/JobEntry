"use client";

import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState,useEffect } from "react";

export default  function EmployerProfilePage() {
   const { data: session,status} = useSession();
    const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0 });

  useEffect(() => {
    if (session?.user) {
      fetch("/api/employer/state")
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session?.user) {
    return <p>You must be logged in to see this page.</p>;
  }
  
  const user = session?.user

  return (
    <div className="max-w-2xl mx-auto py-10">
      <ProfileCard {...user} role="EMPLOYER">
        <div className="space-y-4">
          <h3 className="font-semibold">My Job Posts</h3>
          <p className="text-sm text-gray-600">
            You currently have <b>{stats.activeJobs} active jobs</b>.
          </p>
          <Link href="/dashboard/employer/Post">
            {" "}
            <Button
              variant="outline"
              className="text-[18px] hover:bg-[#34d399] cursor-pointer"
            >
              Post a New Job
            </Button>
          </Link>

          <h3 className="font-semibold">Applications Received</h3>
          <p className="text-sm text-gray-600">
            You have <b>{stats.totalApplications} new applications</b>.
          </p>

          <Link href ="/dashboard/employer/applications">
            <Button
            variant="outline"
            className="text-[18px] hover:bg-[#34d399] cursor-pointer"
          >
            View Applications
          </Button>
          </Link>
        </div>
        <Link href="/Bookmarked">
          <Button variant="link" className="cursor-pointer text-[#3fb187]">Bookmarked Job Post</Button>
        </Link>
      </ProfileCard>
    </div>
  );
}
