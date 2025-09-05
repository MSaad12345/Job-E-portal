import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import { AppContext } from "../Context/AppContext";

export default function JobseekerProfile() {
  const [skills, setSkills] = useState("");
  const [desiredJobTitle, setDesiredJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile", {
        role: "jobseeker",
        jobseekerProfile: {
          skills,
          desiredJobTitle,
          description,
        },
      });

      console.log(res.data);
      setUser(res.data.user);
      navigate(res.data.redirectUrl);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Jobseeker Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Desired Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Desired Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={desiredJobTitle}
              onChange={(e) => setDesiredJobTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              placeholder="Write about your experience, background, and career goals..."
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
