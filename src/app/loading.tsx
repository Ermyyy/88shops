import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-shell py-10">
      <Skeleton className="h-16 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}
