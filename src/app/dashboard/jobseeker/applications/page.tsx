import { auth } from "@/auth";
import { AlertButton } from "@/components/JobAlertButton";
import { BookmarkButton } from "@/components/togglebutton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.MAX_SAFE_INTEGER, "year"],
  ];

  let unit = "second";
  let value = seconds;
  for (const [limit, name] of intervals) {
    if (value < limit) {
      unit = name;
      break;
    }
    value = Math.floor(value / limit);
  }
  return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
}

export default async function JobSeekerApplications() {
  const session = await auth();
  const role = session?.user.role;
  if (!session?.user.id) {
    redirect("/Login");
  }
  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      job: {
        include: {
          bookmarks: true,
          _count: {
            select: { applications: true }, // ✅ count how many applied to this job
          },
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Job Board</h1>

      <div className="grid gap-4">
        {applications.map((jobs) => (
          <div
            key={jobs.job.id}
            className="rounded-xl p-5 border border-green-500 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-green-600">
              {jobs.job.title}
            </h2>
            <p className="text-gray-700 mt-2">{jobs.job.description}</p>

            {/* Status + Posted time */}
            <div className="flex justify-between items-center mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  jobs.job.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : jobs.job.status === "EXPIRED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {jobs.job.status}
              </span>
              <span className="text-gray-500 text-sm">
                Posted {timeAgo(jobs.job.createdAt)}
              </span>
            </div>

            {/* Applicants count */}
            <div className="mt-3 text-sm text-gray-600">
              {jobs.job._count.applications} applicant
              {jobs.job._count.applications !== 1 ? "s" : ""}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-4">
              {role === "JOBSEEKER" && jobs.job.status === "ACTIVE" ? (
                <Link href={`/jobs/${jobs.job.id}/apply`}>
                  <Button
                    variant="outline"
                    className="text-[18px] hover:bg-[#34d399]"
                    disabled={true}
                  >
                    Applied
                  </Button>
                </Link>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  {role === "EMPLOYER"
                    ? "Employers cannot apply."
                    : jobs.job.status !== "ACTIVE"
                    ? "Applications closed."
                    : "Login as Jobseeker to apply."}
                </p>
              )}
              {session?.user?.id && (
                <BookmarkButton
                  jobId={jobs.job.id}
                  alreadyBookmarked={jobs.job.bookmarks.length > 0}
                />
              )}
              <a href={`/api/job/download/${jobs.job.id}`} download>
                <Button
                  variant="outline"
                  className="text-[18px] hover:bg-[#34d399] cursor-pointer"
                >
                  Download
                </Button>
              </a>
              {session?.user?.id && role === "JOBSEEKER" && (
                <>
                  <AlertButton jobId={jobs.job.id} />
                  <Button 
                    className={`px-2 py-1 rounded text-xs font-medium
      ${jobs.status === "APPROVED" ? "bg-green-100 text-green-700" : ""}
      ${jobs.status === "REJECTED" ? "bg-red-100 text-red-700" : ""}
      ${jobs.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
    `}
                  >
                    {jobs.status}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
