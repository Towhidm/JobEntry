import { prisma } from "@/lib";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// helper to format date
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

export default async function MyPostsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">You must be logged in to view your posts.</p>
        <Link
          href="/auth/signin"
          className="text-green-600 underline mt-2 hover:text-green-700"
        >
          Login
        </Link>
      </div>
    );
  }

  const posts = await prisma.job.findMany({
    where: { createdById: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">You haven’t posted any jobs yet.</p>
        <Link
          href="/post-job"
          className="text-green-600 underline mt-2 hover:text-green-700"
        >
          Post your first job
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">My Job Posts</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className=" rounded-xl p-4 shadow-sm hover:shadow-md transition border-2 border-[#22c55e]"
          >
            <h2 className="text-xl font-semibold text-[#22c55e]">
              {post.title}
            </h2>
            <p className="text-gray-700 mt-2">{post.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  post.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : post.status === "EXPIRED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {post.status}
              </span>

              <span className="text-gray-500 text-sm">
                Posted {timeAgo(post.createdAt)}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <Link href={`/dashboard/employer/applicants/${post.id}`}>
                <Button variant="link" className="cursor-pointer">
                  {post._count.applications} applicant
                  {post._count.applications !== 1 ? "s" : ""}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
