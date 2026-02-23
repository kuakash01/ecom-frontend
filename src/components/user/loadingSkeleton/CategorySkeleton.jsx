function CategorySkeleton() {
  return (
    <div
      className="
        flex-shrink-0

        w-[160px]
        sm:w-[180px]
        md:w-[200px]

        bg-white
        rounded-3xl
        overflow-hidden
        shadow-sm
        border border-gray-100
      "
    >
      {/* Image Skeleton */}
      <div
        className="
          skeleton
          w-full
          aspect-[4/5]
        "
      />

      {/* Text Skeleton */}
      <div className="p-3 flex justify-center">
        <div
          className="
            skeleton
            h-3
            w-3/4
            rounded-full
          "
        />
      </div>
    </div>
  );
}

export default CategorySkeleton;