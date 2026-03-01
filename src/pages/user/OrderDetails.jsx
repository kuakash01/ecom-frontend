import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import api from "../../config/apiUser";
import { ArrowPrevIcon } from "../../icons";
import useScrollToTop from "../../hooks/useScrollToTop";

/* ================= MAIN ================= */

const OrderDetails = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const justPlaced = location.state?.justPlaced;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOrderDetails = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data.data.order);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, [orderId]);

    useScrollToTop();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-500">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-red-500">Order not found</p>
            </div>
        );
    }

    return (
        <div className="w-full">

            {justPlaced && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    🎉 Your order has been placed successfully!
                </div>
            )}

            {/* BACK */}
            <Link
                to="/profile/orders"
                className="inline-flex items-center mb-6 text-sm text-blue-600 hover:underline"
            >
                <ArrowPrevIcon className="mr-2" />
                Back to Orders
            </Link>

            {/* MAIN CARD */}
            <div className="w-full bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-4 sm:p-6 lg:p-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Order #{order.orderId}
                        </h2>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </div>

                {/* PROGRESS */}
                <OrderProgress status={order.status} />

                {/* ITEMS */}
                <Section title="Items in your order">
                    {order.items.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                        >
                            <Link
                                to={`/products/${item.product}`}
                                className="flex-shrink-0"
                            >
                                <img
                                    src={item.gallery[0]?.url}
                                    alt={item.title}
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border"
                                />
                            </Link>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                        {item.title}
                                    </p>

                                    <div className="flex flex-col text-xs text-gray-500 mt-2">
                                        <span>
                                            Size:{" "}
                                            <span className="font-medium text-gray-700">
                                                {item.size}
                                            </span>
                                        </span>
                                        <span>
                                            Qty:{" "}
                                            <span className="font-medium text-gray-700">
                                                {item.quantity}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    {item.mrp > item.price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{item.mrp}
                                        </span>
                                    )}
                                    <span className="text-base font-semibold text-gray-900">
                                        ₹{item.price}
                                    </span>
                                </div>
                            </div>

                            <div className="sm:text-right mt-3 sm:mt-0">
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="font-semibold text-gray-800">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </Section>

                {/* ADDRESS + PAYMENT */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <Section title="Delivery address">
                        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                            <p className="font-medium text-gray-800">
                                {order.address.fullName}
                            </p>

                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {order.address.street}, {order.address.city},{" "}
                                {order.address.state} - {order.address.pincode}
                            </p>

                            <p className="text-sm text-gray-600 mt-2">
                                📞 {order.address.phone}
                            </p>
                        </div>
                    </Section>

                    <Section title="Payment info">
                        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 space-y-2">
                            <Row label="Method" value={order.paymentDetails.method} />
                            <Row
                                label="Amount paid"
                                value={`₹${order.paymentDetails.payableAmount}`}
                            />
                            <Row
                                label="Status"
                                value={<StatusBadgeTxn status={order.paymentDetails.status} />}
                            />
                            <Row
                                label="Transaction ID"
                                value={order.paymentDetails.transactionId || "N/A"}
                            />
                        </div>
                    </Section>
                </div>

                {/* PRICE DETAILS */}
                <Section title="Price details">
                    <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-100 space-y-2 text-sm">
                        <Row
                            label="Sub Total"
                            value={`₹${order?.priceSummary?.mrpSubTotal || ""}`}
                        />

                        <Row
                            label="Discount"
                            value={
                                order.priceSummary.discount > 0
                                    ? `- ₹${order.priceSummary.discount}`
                                    : "₹0"
                            }
                            green={order.priceSummary.discount > 0}
                        />

                        <Row
                            label="Delivery"
                            value={
                                order.priceSummary.deliveryCharge === 0
                                    ? "Free"
                                    : `₹${order.priceSummary.deliveryCharge}`
                            }
                        />

                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold text-base text-gray-900">
                            <span>Total</span>
                            <span>₹{order.priceSummary.total}</span>
                        </div>

                        <p className="text-xs text-gray-500 text-right mt-1">
                            Inclusive of all taxes
                        </p>
                    </div>
                </Section>

            </div>
        </div>
    );
};

export default OrderDetails;

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
    <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);


const Row = ({ label, value, green }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className={`font-medium ${green ? "text-green-600" : "text-gray-800"}`}>{value || "-"}</span>
    </div>
);


/* ================= BADGES ================= */

const StatusBadge = ({ status }) => {

    const classes = {
        pending: "bg-gray-100 text-gray-700 border border-gray-200",
        processing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        shipped: "bg-blue-50 text-blue-700 border border-blue-200",
        delivered: "bg-green-50 text-green-700 border border-green-200",
        cancelled: "bg-red-50 text-red-700 border border-red-200"
    };

    return (
        <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${classes[status]}`}
        >
            {status}
        </span>
    );
};


const StatusBadgeTxn = ({ status }) => {

    const classes = {
        pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        completed: "bg-green-50 text-green-700 border border-green-200",
        failed: "bg-red-50 text-red-700 border border-red-200"
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status]}`}
        >
            {status}
        </span>
    );
};


/* ================= PROGRESS ================= */

const OrderProgress = ({ status }) => {
    const steps = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
    ];

    const labels = {
        pending: "Placed",
        confirmed: "Confirmed",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
    };

    const isCancelled = status === "cancelled";
    const isReturned = status === "returned";

    const current = steps.indexOf(status);

    return (
        <div className="w-full mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {steps.map((step, index) => {
                    const active = index <= current && !isCancelled;

                    return (
                        <div
                            key={step}
                            className="flex md:flex-1 md:items-center relative"
                        >
                            {/* Vertical Line (Mobile) */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                    absolute left-4 top-8 w-1 h-full md:hidden rounded
                    ${isCancelled
                                            ? "bg-red-300"
                                            : active
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                        }
                  `}
                                />
                            )}

                            {/* Step Circle */}
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center 
                  text-sm font-semibold z-10
                  ${isCancelled
                                        ? "bg-red-500 text-white"
                                        : active
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }
                `}
                            >
                                {index + 1}
                            </div>

                            {/* Label */}
                            <div className="ml-4 md:ml-2 text-sm md:text-xs text-gray-600">
                                {labels[step]}
                            </div>

                            {/* Horizontal Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                    hidden md:block flex-1 h-1 mx-2 rounded
                    ${isCancelled
                                            ? "bg-red-300"
                                            : active
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                        }
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Cancelled Badge */}
            {isCancelled && (
                <div className="mt-4 text-sm font-semibold text-red-600">
                    Order Cancelled ❌
                </div>
            )}

            {/* Returned Badge */}
            {isReturned && (
                <div className="mt-4 text-sm font-semibold text-orange-500">
                    Order Returned 🔄
                </div>
            )}
        </div>
    );
};