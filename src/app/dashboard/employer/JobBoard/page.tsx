import { prisma } from "@/lib";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/togglebutton";
import { AlertButton } from "@/components/JobAlertButton";

// helper to format time ago
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

export default async function JobBoardPage() {
  const session = await auth();
  const role = session?.user?.role;

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true, bookmarks: true } },
      bookmarks: session?.user?.id
        ? {
            where: { userId: session.user.id },
            select: { id: true }, // check if this user bookmarked
          }
        : false,
      applications: session?.user?.id
        ? {
            where: { userId: session.user.id }, // only current user’s application
            select: { id: true, status: true }, // status = APPROVED/REJECTED/PENDING
          }
        : false,
    },
  });

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Job Board</h1>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl p-5 border border-green-500 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-green-600">
              {job.title}
            </h2>
            <p className="text-gray-700 mt-2">{job.description}</p>

            {/* Status + Posted time */}
            <div className="flex justify-between items-center mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  job.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : job.status === "EXPIRED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {job.status}
              </span>
              <span className="text-gray-500 text-sm">
                Posted {timeAgo(job.createdAt)}
              </span>
            </div>

            {/* Applicants count */}
            <div className="mt-3 text-sm text-gray-600">
              {job._count.applications} applicant
              {job._count.applications !== 1 ? "s" : ""}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-4">
              {role === "JOBSEEKER" && job.status === "ACTIVE" ? (
                job.applications && job.applications.length > 0 ? (
                  <Button
                    variant="outline"
                    disabled
                    className="text-[18px] bg-gray-200 cursor-not-allowed"
                  >
                    Applied
                  </Button>
                ) : (
                  <Link href={`/jobs/${job.id}/apply`}>
                    <Button
                      variant="outline"
                      className="text-[18px] hover:bg-[#34d399] cursor-pointer"
                    >
                      Apply
                    </Button>
                  </Link>
                )
              ) : (
                <p className="text-gray-500 text-sm italic">
                  {role === "EMPLOYER"
                    ? "Employers cannot apply."
                    : job.status !== "ACTIVE"
                    ? "Applications closed."
                    : "Login as Jobseeker to apply."}
                </p>
              )}

              {session?.user?.id && (
                <BookmarkButton
                  jobId={job.id}
                  alreadyBookmarked={job.bookmarks.length > 0}
                />
              )}
              <a href={`/api/job/download/${job.id}`} download>
                <Button
                  variant="outline"
                  className="text-[18px] hover:bg-[#34d399] cursor-pointer"
                >
                  Download
                </Button>
              </a>
              {session?.user?.id && role === "JOBSEEKER" && (
                <AlertButton jobId={job.id} />
              )}
              {job.applications && job.applications.length > 0 && (
                <div className="mt-2 text-sm">
                  <Button
                    className={`px-2 py-1 rounded text-xs font-medium
        ${
          job.applications[0].status === "APPROVED"
            ? "bg-green-100 text-green-700"
            : ""
        }
        ${
          job.applications[0].status === "REJECTED"
            ? "bg-red-100 text-red-700"
            : ""
        }
        ${
          job.applications[0].status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : ""
        }
      `}
                  >
                    {job.applications[0].status}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
