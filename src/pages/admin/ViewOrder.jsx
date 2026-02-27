import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/apiAdmin";
import { useRef } from "react";

function AdminOrderDetails() {
    const { id } = useParams();
    // const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const invoiceRef = useRef();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/admin/orders/${id}`);
            setOrder(res.data.data);
            console.log(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdating(true);
            await api.patch(`/admin/orders/${id}/status`, {
                status: newStatus
            });
            setOrder(prev => ({ ...prev, status: newStatus }));
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!order) return <div className="p-6 text-red-500">Order not found</div>;

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-600",
        confirmed: "bg-blue-100 text-blue-600",
        processing: "bg-indigo-100 text-indigo-600",
        shipped: "bg-purple-100 text-purple-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600",
        returned: "bg-orange-100 text-orange-600"
    };

    const paymentColor = {
        pending: "bg-yellow-100 text-yellow-600",
        paid: "bg-green-100 text-green-600",
        failed: "bg-red-100 text-red-600",
        refunded: "bg-orange-100 text-orange-600"
    };

    return (
        <div className="w-full p-6 space-y-6 text-black dark:text-white">

            {/* Top Summary */}
            {/* Top Summary Bar */}
            <div className="bg-white dark:bg-admin-dark-500 shadow rounded-xl p-6 flex flex-col lg:flex-row justify-between gap-4">

                {/* Left Info */}
                <div>
                    <h1 className="text-xl font-bold">Order #{order.orderId}</h1>
                    <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="flex gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                            {order.status}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentColor[order.paymentDetails.status]}`}>
                            {order.paymentDetails.status}
                        </span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col gap-3 items-start lg:items-end">

                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className="border px-3 py-2 rounded-md text-black"
                    >
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
                            .map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                    </select>

                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-black text-white rounded-md"
                    >
                        Print Invoice
                    </button>

                    <div className="text-lg font-semibold">
                        Total: ₹{order.priceSummary.total}
                    </div>

                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Items */}
                <div className="lg:col-span-2 bg-white dark:bg-admin-dark-500 shadow rounded-xl p-6">
                    <h2 className="font-semibold mb-4">Order Items</h2>

                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-2">Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2">{item.title}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-center">₹{item.price}</td>
                                    <td className="text-center font-medium">₹{item.subTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RIGHT: Info + Price */}
                <div className="space-y-6">

                    {/* Customer */}
                    <div className="bg-white dark:bg-admin-dark-500 shadow rounded-xl p-6">
                        <h2 className="font-semibold mb-3">Customer</h2>
                        <p>{order.user?.name}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </div>

                    {/* Address */}
                    <div className="bg-white dark:bg-admin-dark-500 shadow rounded-xl p-6">
                        <h2 className="font-semibold mb-3">Shipping Address</h2>
                        <p>{order.address.fullName}</p>
                        <p>{order.address.phone}</p>
                        <p>
                            {order.address.addressLine1}, {order.address.addressLine2}
                        </p>
                        <p>
                            {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                    </div>

                    {/* Payment */}
                    <div className="bg-white dark:bg-admin-dark-500 shadow rounded-xl p-6">
                        <h2 className="font-semibold mb-3">Payment</h2>
                        <p><strong>Method:</strong> {order.paymentDetails.method}</p>
                        <p><strong>Transaction:</strong> {order.paymentDetails.transactionId || "N/A"}</p>
                        <p><strong>Status:</strong> {order.paymentDetails.status}</p>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gray-50 dark:bg-admin-dark-700 shadow rounded-xl p-6">
                        <h2 className="font-semibold mb-3">Price Summary</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{order.priceSummary.subTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST</span>
                                <span>₹{order.priceSummary.taxAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>₹{order.priceSummary.deliveryCharge}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                                <span>Total</span>
                                <span>₹{order.priceSummary.total}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div ref={invoiceRef} className="hidden print:block p-10 text-black">

                <h1 className="text-2xl font-bold mb-6">INVOICE</h1>

                <div className="mb-6">
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold">Bill To:</h2>
                    <p>{order.address.fullName}</p>
                    <p>{order.address.phone}</p>
                    <p>
                        {order.address.addressLine1}, {order.address.addressLine2}
                    </p>
                    <p>
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    <p>{order.address.country}</p>
                </div>

                <table className="w-full border-collapse border text-sm mb-6">
                    <thead>
                        <tr>
                            <th className="border p-2 text-left">Product</th>
                            <th className="border p-2">Qty</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td className="border p-2">{item.title}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-center">₹{item.price}</td>
                                <td className="border p-2 text-center">₹{item.subTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="ml-auto w-64 text-sm space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.priceSummary.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>GST</span>
                        <span>₹{order.priceSummary.taxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>₹{order.priceSummary.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total</span>
                        <span>₹{order.priceSummary.total}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminOrderDetails;