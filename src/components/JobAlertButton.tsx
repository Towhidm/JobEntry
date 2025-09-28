"use client";

import { useTransition } from "react";
import { createJobAlert } from "@/actions/JobAlert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AlertButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await createJobAlert(jobId);
      if (result.success) {
        toast.success("Job alert created!");
      } else {
        toast.error(result.message || "Failed to create alert.");
      }
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handleClick}
      className="text-[18px] bg-[#dc2626] cursor-pointer hover:bg-[#b91c1c]"
    >
      {isPending ? "Creating..." : "Create Alert"}
    </Button>
  );
}
