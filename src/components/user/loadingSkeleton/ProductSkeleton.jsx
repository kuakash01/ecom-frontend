const Skeleton = ({ className }) => (
  <div
    className={`
      animate-pulse
      bg-gray-200
      rounded
      ${className}
    `}
  />
);

function ProductSkeleton() {
  return (
    <div className="w-full bg-white py-8 overflow-x-hidden">

      <div className="max-w-[1400px] mx-auto px-4">

        <div className="grid grid-cols-12 gap-4 lg:gap-10">


          {/* ================= IMAGES ================= */}
          <div className="col-span-12 lg:col-span-7">


            {/* Mobile Slider Skeleton */}
            <div className="lg:hidden">

              <div className="flex overflow-x-hidden">

                <Skeleton className="w-full aspect-square rounded-xl" />

              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>

            </div>


            {/* Desktop Grid Skeleton */}
            <div className="hidden lg:grid grid-cols-2 gap-5">

              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full aspect-square rounded-xl"
                />
              ))}

            </div>

          </div>



          {/* ================= INFO ================= */}
          <div className="col-span-12 lg:col-span-5 space-y-8">


            {/* Title */}
            <Skeleton className="h-8 w-4/5" />


            {/* Price */}
            <div className="flex gap-4 items-center">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>


            {/* Divider */}
            <Skeleton className="h-px w-full" />


            {/* Colors */}
            <div className="space-y-3">

              <Skeleton className="h-4 w-24" />

              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-9 h-9 rounded-full"
                  />
                ))}
              </div>

            </div>


            {/* Sizes */}
            <div className="space-y-3">

              <Skeleton className="h-4 w-24" />

              <div className="flex gap-3 flex-wrap">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-16 h-9 rounded-md"
                  />
                ))}
              </div>

            </div>


            {/* Buttons */}
            <div className="flex gap-4 pt-3">

              <Skeleton className="h-12 flex-1 rounded-full" />
              <Skeleton className="h-12 flex-1 rounded-full" />

            </div>


            {/* Trust Info */}
            <div className="space-y-2 pt-4">

              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-4 w-2/3"
                />
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductSkeleton;