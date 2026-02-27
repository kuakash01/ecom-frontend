import api from "../config/apiUser";
const openRazorpay = (data, navigate) => {
    const options = {
        key: data.key, // from backend
        amount: data.amount, // optional if you send
        currency: "INR",
        order_id: data.razorpayOrderId,

        handler: async function (response) {
            try {
                const verifyRes = await api.post("/orders/verify-payment", response);

                if (verifyRes.data.status === "success") {
                    navigate(`/profile/orders/${data.orderDocId}`, {
                        replace: true,
                        state: { justPlaced: true }
                    });
                } else {
                    navigate("/checkout?payment=failed", { replace: true });
                }
            } catch (err) {
                navigate("/checkout?payment=failed", { replace: true });
            }
        },

        modal: {
            ondismiss: function () {
                navigate("/checkout?payment=failed", { replace: true });
            }
        },

        theme: {
            color: "#000000"
        }
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function () {
        navigate("/checkout?payment=failed", { replace: true });
    });

    rzp.open();
};

export default openRazorpay;