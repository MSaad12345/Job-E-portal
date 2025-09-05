import React, { useEffect, useState, useContext, useRef } from "react";
import api from "../Api";
import JobCard from "../JobCard";
import { AppContext } from "../Context/AppContext";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from '../assets/avatar_icon.png' 

const Homepage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const Base_URL = import.meta.env.VITE_BASE_URL;


  const { logout } = useContext(AppContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await api.get("/getUser");
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err.message);
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get("/Getjobs");
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchJobs();
  }, []);

  const handleSearch = async (e) => {
     e.preventDefault();
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


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold hidden sm:flex text-gray-900">Latest Jobs</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search + Logout */}
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
            type="submit"
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200"
            >
              <UserCircle className="w-8 h-8 text-gray-700 cursor-pointer" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-10">
                <div className="flex justify-center rounded-full py-5"><img src={user.profileImage ? `${Base_URL}${user.profileImage}` : Avatar} alt="" className="h-30 w-30 rounded-full"/></div>
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">{user?.name || "Guest User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <h3 className="pt-3">Skills</h3>
                  <p className="text-xs text-gray-500">{user?.jobseekerProfile.skills}</p>
                  <h3 className=" pt-3">description</h3>
                  <p className="text-xs text-gray-500">{user?.jobseekerProfile.description}</p>
                </div>

                <button
                  onClick={() => navigate("/jobseekerprofile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
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
        </div>
      </div>
          <h1 className="text-3xl pb-4 font-bold flex sm:hidden text-gray-900">Latest Jobs</h1>
      

      {/* Jobs Section */}
      {loading ? (
        <p className="text-gray-600 text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No jobs found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
               job={job}  
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              description={job.description}
              jobType={job.jobType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
