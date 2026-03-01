import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config/apiUser";
import useScrollToTop from "../../hooks/useScrollToTop";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  const statusClasses = {
    delivered: "bg-green-100 text-green-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    pending: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    returned: "bg-purple-100 text-purple-700",
  };

  // ================= FETCH =================
  const getOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          My Orders
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Track and manage your purchases
        </p>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-gray-500 mb-4">
            You haven’t placed any orders yet
          </p>

          <Link
            to="/shop"
            className="text-indigo-600 font-medium hover:underline"
          >
            Start Shopping →
          </Link>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 p-5 sm:p-6"
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Order #{order.orderId}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Placed on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>

              {/* STATUS */}
              <span
                className={`px-4 py-1.5 text-sm rounded-full font-medium w-fit
                  ${
                    statusClasses[
                      order.status?.toLowerCase()
                    ] || "bg-gray-100 text-gray-700"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* DIVIDER */}
            <div className="border-t my-4" />

            {/* BOTTOM */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* SUMMARY */}
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium">Total:</span>{" "}
                  ₹{order.priceSummary?.total}
                </p>

                {order.items && (
                  <p className="text-gray-500 mt-1">
                    {order.items.length} item
                    {order.items.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* ACTION */}
              <Link
                to={`${order._id}`}
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;