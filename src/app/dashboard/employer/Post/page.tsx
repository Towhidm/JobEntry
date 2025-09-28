"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PostJobs from "@/actions/PostJob";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const result = await PostJobs(form)
    if(result.success){
        setLoading(true);

    }
    else{
        setLoading(false);
    }
    
    

     if (result.success) {
      router.push("/dashboard/employer/Post/MyPosts"); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-15 py-10 px-10 shadow-lg border-[#22c55e] border-2 bg-[#f5f5f5] rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-[#22c55e]">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <Label htmlFor="title" className="text-[#22c55e] py-2">Job Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Frontend Developer"
            className="text-[#22c55e] border-2 border-[#22c55e]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-[#22c55e] py-2">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Write job description here..."
            required
            className="text-[#22c55e] border-2 border-[#22c55e]"
          />
        </div>

        {/* Job Status */}
        <div>
          <Label htmlFor="status" className="text-[#22c55e] py-2">Status</Label>
          <Select name="status" defaultValue="ACTIVE" >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button type="submit" variant="outline" className="w-full text-[#22c55e] text-[18px] hover:bg-[#22c55e] hover:text-white cursor-pointer" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
}
