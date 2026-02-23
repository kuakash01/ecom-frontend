const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

function ProductSkeleton() {
  return (
    <div className="py-2 px-2 lg:px-10 animate-pulse">
      <div className="grid grid-cols-12 gap-4">
        
        {/* Left: Image Section */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-3">
          
          {/* Gallery Thumbnails */}
          <div className="col-span-12 lg:col-span-3 flex flex-row md:flex-col gap-2 overflow-hidden">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="min-w-24 md:min-w-full h-24 rounded-2xl" />
            ))}
          </div>

          {/* Main Image */}
          <div className="col-span-12 lg:col-span-9">
            <Skeleton className="w-full h-[400px] rounded-2xl" />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="col-span-12 lg:col-span-6 space-y-5 p-5">
          {/* Title */}
          <Skeleton className="h-8 w-3/4" />

          {/* Price */}
          <div className="flex gap-4 items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          {/* Colors */}
          <p className="text-sm font-medium text-gray-500">Select Color</p>
          <div className="flex gap-3">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-16 rounded-full" />
            ))}
          </div>

          {/* Sizes */}
          <p className="text-sm font-medium text-gray-500">Select Size</p>
          <div className="flex gap-3">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-14 rounded-full" />
            ))}
          </div>

          {/* Qty & Add To Cart */}
          <div className="flex gap-5 pt-3">
            <Skeleton className="h-12 w-28 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>

      {/* Reviews Section Preview */}
      <div className="mt-10 space-y-6">
        {[...Array(2)].map((_, idx) => (
          <Skeleton key={idx} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default ProductSkeleton;
