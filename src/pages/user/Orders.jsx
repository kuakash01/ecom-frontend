// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import api from "../../config/axios";



// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const statusClasses = {
//         delivered: "bg-green-100 text-green-700 border border-green-200",
//         processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
//         shipped: "bg-blue-100 text-blue-700 border border-blue-200",
//         pending: "bg-gray-100 text-gray-600 border border-gray-200",
//         cancelled: "bg-red-100 text-red-700 border border-red-200",
//         returned: "bg-purple-100 text-purple-700 border border-purple-200",
//     };

//     const getOrders = async () => {
//         try {
//             const res = await api.get("/orders");
//             console.log(res.data);
//             setOrders(res.data.data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         getOrders();
//     }, []);

//     return (
//         <div className="border border-gray-300 rounded-2xl p-6">

//             <h2 className="text-2xl font-semibold mb-6">
//                 My Orders
//             </h2>

//             {orders.length === 0 ? (
//                 <p className="text-gray-500 text-center">
//                     No orders yet
//                 </p>
//             ) : (
//                 <div className="flex flex-col gap-4">

//                     {orders.map(order => (
//                         <div
//                             key={order.orderId}
//                             className="border rounded-xl p-4 hover:border-black transition"
//                         >

//                             <div className="flex justify-between items-center">

//                                 <div>
//                                     <p className="font-medium">
//                                         Order #{order.orderId}
//                                     </p>

//                                     <p className="text-sm text-gray-500">
//                                         Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {

//                                             day: "2-digit",
//                                             month: "short",
//                                             year: "numeric"
//                                         }) : "N/A"}
//                                     </p>
//                                 </div>

//                                 <span
//                                     className={`text-sm px-3 py-1 rounded-full 
//                                         ${statusClasses[order.status.toLowerCase()] || "bg-gray-100 text-gray-600"}`}
//                                 >
//                                     {order.status}
//                                 </span>

//                             </div>

//                             <div className="flex justify-between items-center mt-3">

//                                 <p className="font-medium">
//                                     Total: ₹{order.priceSummary.total}
//                                 </p>

//                                 <Link
//                                     to={`${order._id}`}
//                                     className="text-sm underline font-medium"
//                                 >
//                                     View Details
//                                 </Link>

//                             </div>

//                         </div>
//                     ))}

//                 </div>
//             )}
//         </div>
//     );
// };

// export default Orders;




import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config/axios";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


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
      <div className="py-16 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-8">

        <h2 className="text-3xl font-semibold text-gray-900">
          My Orders
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Track and manage your purchases
        </p>

      </div>


      {/* EMPTY */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

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
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >

            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

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
