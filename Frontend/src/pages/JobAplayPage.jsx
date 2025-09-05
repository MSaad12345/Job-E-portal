import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../Api";
import { X, FileText, Building2, MapPin, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/Getjobid/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error("Error fetching job:", err.message);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload your resume!");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("jobId", id);
    formData.append("resume", resume);

    try {
      await api.post("/applyJob", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully ✅");
      navigate("/home")
    } catch (err) {
      console.error("Error applying:", err.message);
      alert("Error submitting application ❌");
    }
  };

  if (!job) return <p className="text-center mt-10 text-gray-600">Loading job...</p>;

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
        <button
          onClick={() => navigate("/home")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Job Info */}
      <div className="space-y-3 mb-6">
        <h1 className="text-3xl font-semibold text-blue-600">{job.title}</h1>
        <p className="flex items-center text-gray-700">
          <Building2 className="w-5 h-5 mr-2 text-gray-500" /> {job.company}
        </p>
        <p className="flex items-center text-gray-700">
          <MapPin className="w-5 h-5 mr-2 text-gray-500" /> {job.location}
        </p>
        <p className="flex items-center text-gray-700">
          <DollarSign className="w-5 h-5 mr-2 text-gray-500" /> {job.salary}
        </p>
        <p className="flex items-center text-gray-700">
          <Briefcase className="w-5 h-5 mr-2 text-gray-500" /> {job.jobType}
        </p>
        <p className="text-gray-600 leading-relaxed">{job.description}</p>
      </div>

      {/* Application Form */}
      <form
        onSubmit={handleApply}
        className="space-y-4 border-t pt-6"
      >
        <div>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="resume"
            className="flex items-center justify-center gap-2 w-full border-2 border-dashed py-4 rounded-lg cursor-pointer hover:bg-gray-50 font-medium text-gray-700"
          >
            <FileText className="w-5 h-5 text-gray-500" />
            Upload Resume / CV
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            required
            className=""
            id="resume"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md"
          whileTap={{ scale: 0.95 }}
        >
          Submit Application
        </motion.button>
      </form>
    </motion.div>
  );
}
