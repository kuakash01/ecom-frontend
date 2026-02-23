const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

function ShopSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 lg:px-8 max-w-[1400px] mx-auto flex gap-8">

        {/* ================= FILTER SKELETON (Desktop) ================= */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

            <Skeleton className="h-6 w-32" />

            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            ))}

            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>

        {/* ================= PRODUCTS SKELETON ================= */}
        <div className="flex-1 py-6">

          {/* Header */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-3 shadow-sm space-y-3">

                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ShopSkeleton;