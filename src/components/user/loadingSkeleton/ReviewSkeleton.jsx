function ReviewSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">

      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-3 w-1/4 rounded" />
        </div>
      </div>

      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />

    </div>
  );
}

export default ReviewSkeleton;