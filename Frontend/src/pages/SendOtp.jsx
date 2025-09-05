// src/pages/ForgotPassword.jsx
import { useState } from "react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

export default function SendOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/sendotp", { email });
      setMessage(res.data.message);
      if (res.data.success) {
        localStorage.setItem("resetEmail", email); // ✅ OTP verify page ke liye email save
        navigate("/verifyotp");
      }
    } catch (err) {
      setMessage("Error sending OTP ❌");
    err
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleForgot} className="bg-white shadow-lg p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Send OTP
        </button>
        {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
