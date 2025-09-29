import { prisma } from "@/lib";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// helper for formatting
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

export default async function SavedJobsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">You must be logged in to view your saved jobs.</p>
        <Link
          href="/auth/signin"
          className="text-green-600 underline mt-2 hover:text-green-700"
        >
          Login
        </Link>
      </div>
    );
  }

  const userId = session.user.id;

  // Fetch bookmarked jobs
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          _count: { select: { applications: true } },
        },
      },
    },
    orderBy: { job: { createdAt: "desc" } },
  });

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">You haven’t saved any jobs yet.</p>
        <Link
          href="/dashboard/employer/JobBoard"
          className="text-green-600 underline mt-2 hover:text-green-700"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">My Bookmarked Jobs</h1>
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => {
          const job = bookmark.job;
          return (
            <div
              key={job.id}
              className="rounded-xl p-4 border border-green-500 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-green-600">{job.title}</h2>
              <p className="text-gray-700 mt-2">{job.description}</p>

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

              <div className="mt-3 flex gap-3">
                {/* Apply button for jobseekers */}
                {session.user.role === "JOBSEEKER" && job.status === "ACTIVE" && (
                  <Link href={`/apply/${job.id}`}>
                    <Button variant="outline" className="cursor-pointer">Apply</Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
