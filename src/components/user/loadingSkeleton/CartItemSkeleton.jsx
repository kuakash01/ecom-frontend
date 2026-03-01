const CartItemsSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4 animate-pulse">

          {/* Image */}
          <div className="w-24 h-32 bg-gray-200 rounded-xl" />

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>

        </div>
      ))}
    </div>
  );
};

export default CartItemsSkeleton;