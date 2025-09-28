import { auth } from "@/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";
import { updateApplicationStatus } from "@/actions/updateApplicationStatus";

export default async function ApplicationsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "EMPLOYER") redirect("/");

  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    include: { applications: { include: { user: true } } },
  });

  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Applications for {job.title}</h1>

      {job.applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-4">
          {job.applications.map((app) => (
            <li key={app.id} className="border p-4 rounded">
              <p>
                <strong>Applicant:</strong> {app.user.name || "Unknown"}
              </p>
              <p>
                <strong>Email:</strong> {app.user.email}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Cover Letter:</strong> {app.coverLetter || "N/A"}
              </p>
              <a
                href={app.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View CV
              </a>

              <form
                action={updateApplicationStatus}
                className="mt-3 flex gap-2"
              >
                <input type="hidden" name="appId" value={app.id} />

                {/* Approve button */}
                <button
                  type="submit"
                  name="status"
                  value="APPROVED"
                  className={`px-3 py-1 rounded ${
                    app.status === "APPROVED"
                      ? "bg-green-400 text-white cursor-not-allowed" 
                      : "bg-green-600 text-white"
                  }`}
                  disabled={app.status === "APPROVED"} 
                >
                  {app.status === "APPROVED" ? "Approved" : "Approve"}
                </button>

                {/* Reject button */}
                <button
                  type="submit"
                  name="status"
                  value="REJECTED"
                  className={`px-3 py-1 rounded ${
                    app.status === "REJECTED"
                      ? "bg-red-400 text-white cursor-not-allowed" 
                      : "bg-red-600 text-white"
                  }`}
                  disabled={app.status === "REJECTED"} 
                >
                  {app.status === "REJECTED" ? "Rejected" : "Reject"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
