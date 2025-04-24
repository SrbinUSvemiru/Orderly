"use client";

import { Skeleton } from "../ui/skeleton";

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 gap-x-4 h-full w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton className="h-5 w-full" key={i} />
      ))}
    </div>
  );
}

export default SidebarSkeleton;
