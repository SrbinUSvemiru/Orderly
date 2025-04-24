"use client";

import React from "react";
import StageSkeleton from "./stage";

function DashboardSkeleton() {
  return (
    <div className="flex gap-x-4 h-full w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <StageSkeleton key={i} i={i + 1} />
      ))}
    </div>
  );
}

export default DashboardSkeleton;
