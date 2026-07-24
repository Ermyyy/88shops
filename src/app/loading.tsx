import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-shell py-6 md:py-8">
      <Skeleton className="h-10 w-2/3 max-w-xl" />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}
