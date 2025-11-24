import { X } from "lucide-react";
import { useState, useEffect } from "react";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-8 relative animate-slideUp">

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-center text-xl font-bold mb-2">LOG IN / SIGN UP</h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Join now for seamless shopping experience
        </p>

        {/* Benefits */}
        <ul className="mb-6 text-gray-700 text-sm space-y-2">
          <li>✓ Easy order tracking</li>
          <li>✓ Manage returns within 15 days</li>
          <li>✓ Exclusive deals and extra perks</li>
        </ul>

        {/* Email Input */}
        <label className="text-sm text-gray-700 font-medium">Email Address*</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="text-xs text-gray-500 mt-2">
          By continuing, I agree to the
          <span className="text-black font-medium cursor-pointer"> Terms & Conditions </span>
          and
          <span className="text-black font-medium cursor-pointer"> Privacy Policy</span>.
        </p>

        {/* Button */}
        <button
          className="w-full mt-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition"
        >
          Continue
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-300 w-full"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>

        {/* Google Button */}
        <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/icons/google.png`}
            className="w-5 h-5"
            alt="Google logo"
          />
          Continue with Google
        </button>

      </div>
    </div>
  );
};

export default AuthModal;
