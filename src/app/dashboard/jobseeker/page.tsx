"use client";

import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobSeekerProfilePage() {
  const { data: session } = useSession();
  const [data, setData] = useState({ applications: 0, bookmarked: 0 });
  useEffect(() => {
    if (session?.user) {
      fetch("/api/jobseeker/state")
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  });

  const user = session?.user;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <ProfileCard {...user} role="JOBSEEKER">
        <div className="space-y-4">
          <h3 className="font-semibold">My Applications</h3>
          <p className="text-sm text-gray-600">
            You have applied to{" "}
            <b>
              {data.applications} job{data.applications > 1 ? "s" : " "}{" "}
            </b>
            .
          </p>
          <Link href="/dashboard/jobseeker/applications">
            <Button variant="outline" className="cursor-pointer">
              View Applications
            </Button>
          </Link>

          <h3 className="font-semibold">Bookmarked Jobs</h3>
          <p className="text-sm text-gray-600">
            You have{" "}
            <b>
              {data.bookmarked} job{data.bookmarked > 1 ? "s" : ""}
            </b>{" "}
            bookmarked.
          </p>
          <Link href="/Bookmarked">
            <Button variant="outline" className="cursor-pointer">
              View Bookmarks
            </Button>
          </Link>
        </div>
      </ProfileCard>
    </div>
  );
}
