import { prisma } from "@/lib";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/togglebutton";

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

export default async function ApplicantsPage({ params }: { params: { jobId: string } }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id) {
    return <p className="text-center mt-10">You must be logged in to view applicants.</p>;
  }


  const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { applications: true, bookmarks: true } },
        bookmarks: session?.user?.id
          ? {
              where: { userId: params.jobId },
              select: { id: true }, // check if this user bookmarked
            }
          : false,
      },
    });


  if (!jobs) {
    return <p className="text-center mt-10">Job not found or not authorized.</p>;
  }

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
                <Link href={`/apply/${job.id}`}>
                  <Button
                    variant="outline"
                    className="text-[18px] hover:bg-[#34d399] cursor-pointer"
                  >
                    Apply
                  </Button>
                </Link>
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
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

