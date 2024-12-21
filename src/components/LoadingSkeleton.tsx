import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4 p-6 border rounded-lg shadow-sm">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </>
  );
}