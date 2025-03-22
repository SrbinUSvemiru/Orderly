import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const n = 5;
  const arr = Array.from({ length: n }, (_, i) => i);
  return (
    <div className="grid space-y-7">
      {arr.map((el) => (
        <Skeleton className="h-8 w-full" key={el} />
      ))}
    </div>
  );
}
