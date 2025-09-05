// Dashboard.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Trash2 } from "lucide-react";
import api from "../Api";
import { AppContext } from "../Context/AppContext";
import Avatar from '../assets/avatar_icon.png' 


const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const Base_URL = import.meta.env.VITE_BASE_URL;


  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/getUser");
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/Getjobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchJobs();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchJobs();
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/Searchjob", { params: { keyword: search } });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/deletejob/${jobId}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        {/* Line 1: Title + Profile */}
        <div className="flex justify-between gap-3 w-full md:w-auto items-center">
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200"
            >
              <UserCircle className="w-8 h-8 text-gray-700 cursor-pointer" />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-65 bg-white shadow-lg rounded-lg border z-20">
                <div className="flex justify-center rounded-full py-5"><img src={user.profileImage ? `${Base_URL}${user.profileImage}` : Avatar} alt="" className="h-30 w-30 rounded-full"/></div>
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">{user?.name || "Guest User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <h3 className="pt-3">Skills</h3>
                  <p className="text-xs text-gray-500">{user?.employerProfile.companyWebsite}</p>
                  <h3 className=" pt-3">description</h3>
                  <p className="text-xs text-gray-500">{user?.employerProfile.description}</p>
                </div>
                <button
                  onClick={() => navigate("/employerprofile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" cursor-pointer
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-b-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
            <h1 className="text-3xl font-bold text-gray-900">Latest Jobs</h1>

        </div>

        {/* Line 2: Search + Create Job */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={() => navigate("/createjob")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            Create Job
          </button>
        </div>
      </div>

      {/* Jobs Section */}
      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="relative">
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(job._id)}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-100 transition z-10"
              >
                <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
              </button>

              <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="mt-2 text-gray-700 text-sm">{job.description}</p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-600 font-medium">Rs {job.salary}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {job.jobType}
                  </span>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate(`/Updatejob/${job._id}`)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                  >
                    Update Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
