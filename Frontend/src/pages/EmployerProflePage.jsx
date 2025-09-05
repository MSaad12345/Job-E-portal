import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import { AppContext } from "../Context/AppContext";

export default function EmployerProfilePage() {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/profile", {
        role: "employer",
        employerProfile: {
          companyName,
          companyWebsite,
          description,
        },
      });

      setUser(res.data.user);

      if (res.data.redirectUrl) {
        navigate(res.data.redirectUrl);
      } else {
        alert(res.data.message || "Profile updated ✅");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Employer Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. OpenAI Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Company Website */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company Website
            </label>
            <input
              type="text"
              placeholder="e.g. https://company.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              placeholder="Write about your company, values, and hiring goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
