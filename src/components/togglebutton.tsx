"use client";

import { useTransition } from "react";
import { toggleBookmark } from "@/actions/togglebookmarke";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BookmarkButton({
  jobId,
  alreadyBookmarked,
}: {
  jobId: string;
  alreadyBookmarked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(alreadyBookmarked);

  return (
    <Button
      variant="outline"
      className="text-[18px] hover:bg-[#34d399] cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await toggleBookmark(jobId);
          if (res.success) {
            setBookmarked(res.bookmarked ?? false);

          }
        })
      }
    >
      {bookmarked ? "Unsave" : "Save"}
    </Button>
  );
}
