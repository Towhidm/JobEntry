import { prisma } from "@/lib";
import { auth } from "@/auth";
import Link from "next/link";

export default async function AlertsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <p className="p-6 text-center">Please log in to see alerts.</p>;
  }

  const alerts = await prisma.jobAlert.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  if (alerts.length === 0) {
    return <p className="p-6 text-center">No alerts yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">My Alerts</h1>
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-green-600">
              {alert.job.title}
            </h2>
            <p className="text-gray-700">{alert.job.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: {alert.job.status}
            </p>
            <Link
              href={`/jobs/${alert.job.id}`}
              className="text-blue-600 text-sm underline"
            >
              View Job
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
