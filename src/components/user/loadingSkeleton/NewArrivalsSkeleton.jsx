function NewArrivalsSkeleton({ count = 4 }) {
  return (
    <div
      className="
        flex
        gap-6

        overflow-x-auto
        pb-4

        hide-scrollbar

        mx-auto
        max-w-[1220px]
        px-4
      "
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="
            flex-shrink-0

            bg-white
            rounded-3xl
            overflow-hidden
            border
            shadow-sm

            w-[180px]
            sm:w-[200px]
            lg:w-[220px]
          "
        >
          {/* Image */}
          <div
            className="
              skeleton
              w-full
              aspect-[3/4]
            "
          />

          {/* Content */}
          <div className="p-3 lg:p-4 space-y-2">

            {/* Category */}
            <div className="skeleton h-3 w-1/3 rounded-full" />

            {/* Title */}
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />

            {/* Price */}
            <div className="flex gap-3 pt-1">
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-3 w-12 rounded" />
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default NewArrivalsSkeleton;