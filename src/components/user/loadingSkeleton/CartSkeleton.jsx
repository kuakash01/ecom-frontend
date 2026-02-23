const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-16 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 lg:gap-8">


        {/* LEFT — ITEMS */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          <div className="bg-white rounded-2xl shadow p-6 space-y-5">

            <Skeleton className="h-6 w-32" />

            {[...Array(3)].map((_, i) => (
              <div key={i}>

                <div className="flex gap-4 items-center">

                  {/* Image */}
                  <Skeleton className="w-24 h-24 rounded-xl" />

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />

                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 items-end">

                    <Skeleton className="h-5 w-5 rounded-full" />

                    <div className="flex">
                      <Skeleton className="h-8 w-8 rounded-l" />
                      <Skeleton className="h-8 w-10" />
                      <Skeleton className="h-8 w-8 rounded-r" />
                    </div>

                  </div>

                </div>

                {i !== 2 && (
                  <div className="h-px bg-gray-200 my-4" />
                )}

              </div>
            ))}

          </div>

        </div>


        {/* RIGHT — SUMMARY */}
        <div className="col-span-12 lg:col-span-4">

          <div className="bg-white rounded-2xl shadow p-6 space-y-4 sticky top-24">

            <Skeleton className="h-6 w-40" />

            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}

            <div className="h-px bg-gray-200" />

            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl mt-2" />

          </div>

        </div>

      </div>
    </div>
  );
}

export default CartSkeleton;