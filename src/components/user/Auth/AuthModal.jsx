import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "../../../config/apiAdmin";
import { setIsAuthModalOpen, setIsAuthenticated } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AuthModal = ({ isAuthModalOpen, onClose, isAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // ⏱ 30s cooldown
  const [canResend, setCanResend] = useState(true);

  const dispatch = useDispatch();
  const inputsRef = useRef([]);

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter email first");

    try {
      setLoading(true);

      await api.post("auth/send-otp", { email });

      setShowOtp(true);
      startTimer();

      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleSubmitOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6)
      return toast.error("Enter valid OTP");

    try {
      setLoading(true);

      const res = await api.post("auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);

        dispatch(setIsAuthenticated(true));
        dispatch(setIsAuthModalOpen(false));

        toast.success("Login Successful");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP INPUT HANDLING ---------------- */
  const handleOtpChange = (e, index) => {
    if (isNaN(e.value)) return;

    const newOtp = [...otp];
    newOtp[index] = e.value;

    setOtp(newOtp);

    if (e.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
  };

  useEffect(() => {
    if (!canResend && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  /* ---------------- CHANGE EMAIL ---------------- */
  const handleChangeEmail = () => {
    setShowOtp(false);
    setOtp(new Array(6).fill(""));
    setTimer(30);
    setCanResend(true);
  };

  /* ---------------- MODAL CONTROL ---------------- */
  useEffect(() => {
    document.body.style.overflow = isAuthModalOpen ? "hidden" : "auto";
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (!isAuthenticated) dispatch(setIsAuthModalOpen(true));
  }, [isAuthenticated, dispatch]);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">

      <div className="bg-white w-[92%] max-w-md rounded-3xl shadow-2xl p-8 relative">

        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          {showOtp ? "Verify OTP" : "Welcome Back"}
        </h2>

        <p className="text-center text-gray-500 text-sm mb-8">
          {showOtp
            ? `Code sent to ${email}`
            : "Login or create your account"}
        </p>

        {/* Email Input */}
        {!showOtp && (
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {/* OTP Boxes */}
        {showOtp && (
          <>
            <div className="flex justify-between gap-2 mt-4">

              {otp.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={item}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) =>
                    handleOtpChange(e.target, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className="w-12 h-14 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              ))}

            </div>

            {/* Resend + Change */}
            <div className="flex justify-between items-center mt-5 text-sm">

              {/* Change Email */}
              <button
                onClick={handleChangeEmail}
                className="text-gray-600 hover:text-black font-medium"
              >
                Change Email
              </button>

              {/* Resend */}
              {canResend ? (
                <button
                  onClick={handleSendOtp}
                  className="text-black font-medium hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-400">
                  Resend in {timer}s
                </span>
              )}

            </div>
          </>
        )}

        {/* Button */}
        <button
          onClick={showOtp ? handleSubmitOtp : handleSendOtp}
          disabled={loading}
          className="w-full mt-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : showOtp
            ? "Verify & Continue"
            : "Continue"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default AuthModal;












// import { X } from "lucide-react";
// import { useState, useEffect } from "react";
// import api from "../../../config/apiAdmin";
// import { setIsAuthModalOpen, setIsAuthenticated } from "../../../redux/userSlice";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";


// const AuthModal = ({ isAuthModalOpen, onClose, isAuthenticated }) => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtp, setShowOtp] = useState(false);

//   const dispatch = useDispatch();



//   const handleSendOtp = async () => {
//     try {
//       const res = await api.post("auth/send-otp", {
//         email
//       });
//       setShowOtp(true);
//       console.log("otp send response", res.data);
//     } catch (error) {
//       console.error("Error sending otp: ", error);
//     }
//   }
//   const handleSubmitOtp = async () => {
//     try {
//       const res = await api.post("auth/verify-otp", {
//         email,
//         otp
//       });
//       localStorage.setItem("token", res.data.token)
//       if (res.data.status === "success") {
//         dispatch(setIsAuthenticated(true));
//         dispatch(setIsAuthModalOpen(false));
//         toast.success("Login Success");
//       } else {
//         toast.error("Login failed! Try again");
//       }
//     } catch (error) {
//       console.error("Error Submitting otp: ", error)
//       toast.error("something went wrong");
//     } finally {
//       setShowOtp(false);
//     }
//   }

//   // disable background scroll on OPEN
//   useEffect(() => {
//     document.body.style.overflow = isAuthModalOpen ? "hidden" : "auto";
//   }, [isAuthModalOpen]);

//   // close modal when logged in
//   useEffect(() => {
//     if (!isAuthenticated) dispatch(setIsAuthModalOpen(true));
//     // else dispatch(setIsAuthModalOpen(true))
//   }, [isAuthenticated, dispatch]);


//   if (!isAuthModalOpen) return null;


//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center animate-fadeIn">
//       <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-8 relative animate-slideUp">

//         {/* Close Button */}
//         <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
//           onClick={onClose}
//         >
//           <X />
//         </button>

//         <h2 className="text-center text-xl font-bold mb-2">LOG IN / SIGN UP</h2>
//         <p className="text-center text-gray-600 text-sm mb-6">
//           Join now for seamless shopping experience
//         </p>

//         {/* Benefits */}
//         <ul className="mb-6 text-gray-700 text-sm space-y-2">
//           <li>✓ Easy order tracking</li>
//           <li>✓ Manage returns within 15 days</li>
//           <li>✓ Exclusive deals and extra perks</li>
//         </ul>

//         {/* Email Input */}
//         <div>
//           <label className="text-sm text-gray-700 font-medium">Email Address*</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none mt-1"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//         </div>
//         {/* Otp Input */}
//         {showOtp && <div className="mt-2">
//           <label className="text-sm text-gray-700 font-medium">Otp*</label>
//           <input
//             type="email"
//             placeholder="Enter Otp"
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black outline-none mt-1"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <p className="text-xs text-gray-400 hover:text-blue-400 mt-2 "><button className="cursor-pointer" onClick={() => handleSendOtp()}>Resend</button></p>
//         </div>}


//         <p className="text-xs text-gray-500 mt-2">
//           By continuing, I agree to the
//           <span className="text-black font-medium cursor-pointer"> Terms & Conditions </span>
//           and
//           <span className="text-black font-medium cursor-pointer"> Privacy Policy</span>.
//         </p>

//         {/* Button */}
//         {showOtp ? <button onClick={handleSubmitOtp} className="w-full mt-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition">Continue</button> : <button
//           onClick={() => handleSendOtp()}
//           className="w-full mt-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition"
//         >
//           Continue
//         </button>}

//         {/* Divider */}
//         {/* <div className="my-5 flex items-center gap-3">
//           <div className="h-px bg-gray-300 w-full"></div>
//           <span className="text-gray-500 text-sm">OR</span>
//           <div className="h-px bg-gray-300 w-full"></div>
//         </div> */}

//         {/* Google Button */}
//         {/* <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition">
//           <img
//             src={`${import.meta.env.VITE_BASE_URL}/icons/google.png`}
//             className="w-5 h-5"
//             alt="Google logo"
//           />
//           Continue with Google
//         </button> */}

//       </div>
//     </div>
//   );
// };

// export default AuthModal;

