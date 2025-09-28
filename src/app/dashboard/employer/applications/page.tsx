import { auth } from "@/auth"
import { prisma } from "@/lib"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function EmployerJobsWithApplicationsPage() {
  const session = await auth()
  const user = session?.user

  if (!user) redirect("/Login")
  if (user.role !== "EMPLOYER") redirect("/")

  // Get employer jobs that have at least 1 application
  const jobs = await prisma.job.findMany({
    where: {
      createdById: user.id,
      applications: {
        some: {}, 
      },
    },
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Jobs With Applicants</h1>

      {jobs.length === 0 ? (
        <p>No jobs have applications yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">
                {job.applications.length} application(s)
              </p>
              <Link
                href={`/dashboard/employer/applicants/${job.id}`}
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Applications
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
