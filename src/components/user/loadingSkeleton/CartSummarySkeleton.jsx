const SummarySkeleton = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow p-6 sticky top-24 space-y-4 animate-pulse">
      
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-1/3" />

      {/* Subtotal */}
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Discount */}
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Delivery */}
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Total */}
      <div className="flex justify-between">
        <div className="h-5 bg-gray-300 rounded w-20" />
        <div className="h-5 bg-gray-300 rounded w-20" />
      </div>

      {/* Button */}
      <div className="h-12 bg-gray-300 rounded-xl mt-2" />
    </div>
  );
};

export default SummarySkeleton;