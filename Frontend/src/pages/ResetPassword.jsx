// src/pages/ResetPassword.jsx
import { useState } from "react";
import api from "../Api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("resetOtp");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/passwordreset", { email, otp, newPassword });
      setMessage(res.data.message);
      if (res.data.success) {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");
        navigate("/");
      }
    } catch (err) {
      setMessage("Error resetting password ❌");
      err
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleReset} className="bg-white shadow-lg p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-lg mb-4"
        />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg">
          Reset Password
        </button>
        {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
