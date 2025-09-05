import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api";
import { X } from "lucide-react"; // ✅ Close button ke liye

const UpdateJobPage = () => {
  const { jobId } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "",
  });

  const [loading, setLoading] = useState(true);

  // Purana job data fetch
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/Getjob/${jobId}`);
        setFormData(res.data.job);
      } catch (error) {
        console.error("Error fetching job:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Updatejob/${jobId}`, formData);
      alert("Job updated successfully ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating job:", error.message);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading job data...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Update Job</h3>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobPage;
