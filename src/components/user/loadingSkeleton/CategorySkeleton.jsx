function CategorySkeleton() {
  return (
    <>
      {/* ================= MOBILE SKELETON ================= */}
      <div className="md:hidden flex-shrink-0 flex flex-col items-center gap-2">

        {/* Circle Image Skeleton */}
        <div
          className="
            skeleton
            w-20 h-20
            rounded-full
          "
        />

        {/* Text Skeleton */}
        <div
          className="
            skeleton
            h-3
            w-16
            rounded-full
          "
        />
      </div>

      {/* ================= DESKTOP SKELETON ================= */}
      <div
        className="
          hidden md:block

          w-[200px]
          bg-white
          rounded-3xl
          overflow-hidden
          shadow-sm
          border border-gray-200
        "
      >
        {/* Image */}
        <div
          className="
            skeleton
            w-full
            aspect-[4/5]
          "
        />

        {/* Title */}
        <div className="p-4 flex justify-center">
          <div
            className="
              skeleton
              h-4
              w-24
              rounded-full
            "
          />
        </div>
      </div>
    </>
  );
}

export default CategorySkeleton;