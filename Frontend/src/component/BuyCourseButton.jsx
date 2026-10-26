import React from "react";
import api from "../utils/api";

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });

const BuyCourseButton = ({ courseId }) => {
  const handleCheckout = async () => {
    try {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Razorpay test key is not configured.");

      const { data: order } = await api.post("/api/payments/razorpay/order", { courseId });
      const RazorpayCheckout = await loadRazorpayCheckout();
      const checkout = new RazorpayCheckout({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Codetech",
        description: order.courseName,
        order_id: order.orderId,
        handler: async (paymentResponse) => {
          try {
            await api.post("/api/payments/razorpay/verify", paymentResponse);
            window.location.assign(`/course-progress/${courseId}`);
          } catch (error) {
            alert(error.response?.data?.message || "Payment received but verification is pending.");
          }
        },
        modal: {
          ondismiss: () => undefined,
        },
        theme: { color: "#2563eb" },
      });
      checkout.open();
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Unable to start Razorpay checkout.");
    }
  };

  return (
    <button onClick={handleCheckout} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
      Buy Course
    </button>
  );
};

export default BuyCourseButton;
