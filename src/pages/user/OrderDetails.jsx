import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../config/axios";
import { ArrowPrevIcon } from "../../icons";

/* ================= MAIN ================= */

const OrderDetails = () => {

    const { orderId } = useParams();

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

    if (loading) {
        return (
            <p className="text-center text-gray-500 py-20">
                Loading order details...
            </p>
        );
    }

    if (!order) {
        return (
            <p className="text-center text-red-500 py-20">
                Order not found
            </p>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">

            <div className="max-w-4xl mx-auto">

                {/* BACK */}
                <Link
                    to="/profile/orders"
                    className="inline-flex items-center mb-5 text-sm text-blue-600 hover:underline"
                >
                    <ArrowPrevIcon className="mr-2" />
                    Back to Orders
                </Link>


                {/* MAIN CARD */}
                <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-6 md:p-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Order #{order.orderId}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
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

                        <StatusBadge status={order.status} />

                    </div>


                    {/* PROGRESS */}
                    <OrderProgress status={order.status} />


                    {/* ITEMS */}
                    <Section title="Items in your order">

                        {order.items.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col sm:flex-row gap-4 rounded-xl bg-gray-50/60 p-4 ring-1 ring-gray-100"
                            >

                                <Link to={`/products/${item.product}`}>
                                    <img
                                        src={item.gallery[0]?.url}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                                    />
                                </Link>

                                <div className="flex-1">

                                    <p className="font-semibold text-gray-800">
                                        {item.title}
                                    </p>

                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">

                                        <span>Size: {item.size}</span>
                                        <span>Qty: {item.quantity}</span>

                                    </div>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        ₹{item.price}
                                    </p>

                                </div>
                                {/* 
                <div className="text-right">

                  <p className="text-xs text-gray-500">
                    Subtotal
                  </p>

                  <p className="font-medium text-gray-800">
                    ₹{item.subTotal}
                  </p>

                </div> */}

                            </div>
                        ))}

                    </Section>


                    {/* ADDRESS + PAYMENT GRID */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">


                        {/* ADDRESS */}
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


                        {/* PAYMENT */}
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


                    {/* PRICE SUMMARY */}
                    <Section title="Price details">

                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-100 space-y-2 text-sm">

                            <Row
                                label="Items total"
                                value={`₹${order.priceSummary.subTotal}`}
                            />

                            <Row
                                label="Discount"
                                value={
                                    order.priceSummary.discount > 0
                                        ? `- ₹${order.priceSummary.discount}`
                                        : "₹0"
                                }
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

        </div>
    );
};

export default OrderDetails;


/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
    <div className="mb-8">

        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            {title}
        </h3>

        <div className="space-y-4">
            {children}
        </div>

    </div>
);


const Row = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{value || "-"}</span>
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

    const steps = ["pending", "processing", "shipped", "delivered"];

    const labels = {
        pending: "Placed",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered"
    };

    const current = steps.indexOf(status);

    return (
        <div className="flex items-center justify-between mb-8">

            {steps.map((step, index) => {

                const active = index <= current;

                return (
                    <div key={step} className="flex-1 flex items-center">

                        <div
                            className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${active
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"}
              `}
                        >
                            {index + 1}
                        </div>

                        <div className="ml-2 text-xs text-gray-600">
                            {labels[step]}
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`
                  flex-1 h-1 mx-2 rounded
                  ${active ? "bg-green-500" : "bg-gray-200"}
                `}
                            />
                        )}

                    </div>
                );
            })}
        </div>
    );
};

