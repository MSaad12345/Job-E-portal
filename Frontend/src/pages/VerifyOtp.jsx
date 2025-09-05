// src/pages/VerifyOtp.jsx
import { useState } from "react";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/verifyotp", { email, otp });
      setMessage(res.data.message);
      if (res.data.success) {
        localStorage.setItem("resetOtp", otp); // ✅ ResetPassword ke liye OTP bhi save
        navigate("/resetPassword");
      }
    } catch (err) {
      setMessage("Invalid or expired OTP ❌");
      err
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white shadow-lg p-6 rounded-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

        {/* OTP Input */}
        <div className="flex justify-center py-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)} // ✅ Bind with state
          className="mb-4"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
         </div>
        {/* Verify Button */}
        <button
          type="submit"
          disabled={otp.length !== 6} // ✅ disable until 6 digits filled
          className="w-full bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          Verify OTP
        </button>

        {message && (
          <p className="mt-3 text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
