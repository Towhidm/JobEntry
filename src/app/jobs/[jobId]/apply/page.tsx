import { auth } from "@/auth"
import { prisma } from "@/lib"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveApplication } from "@/actions/Apply"

export default async function ApplyPage({ params }: { params: { jobId: string } }) {
  const session = await auth()
  const user = session?.user

  if (!user) redirect("/login")
  if (user.role !== "JOBSEEKER") redirect("/")

  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
  })

  if (!job) return <p>Job not found</p>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-[#1db657]">Apply for {job.title}</h1>
      <form action={saveApplication} className="space-y-4">
        <Input type="hidden" name="jobId" value={job.id} />

        <div>
          <label className="block mb-1 font-medium">Upload CV</label>
          <input type="file" name="cv" required className="border p-2 w-full" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cover Letter</label>
          <Textarea
            name="coverLetter"
            className="border p-2 w-full"
            rows={5}
            placeholder="Write your cover letter..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}
