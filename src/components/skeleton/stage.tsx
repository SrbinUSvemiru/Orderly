"use client";

import { FC } from "react";

const StageSkeleton: FC<{ i: number }> = ({ i }) => (
  <div key={i} className="w-full grid gap-3 h-fit rounded-md">
    <div className="w-[300px] h-[44px] animate-pulse bg-amber-400 rounded-md" />
    {Array.from({ length: i }).map((_, i) => (
      <div
        key={i + 2}
        className="h-[100px] w-[300px]  animate-pulse bg-amber-400 rounded-md"
      />
    ))}
  </div>
);

export default StageSkeleton;
