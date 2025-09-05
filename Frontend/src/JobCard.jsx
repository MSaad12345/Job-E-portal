import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job, title, company, location, salary, description, jobType }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
      {/* Job Title */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{company}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
        
        {/* Time Ago */}
        <span className="text-xs text-gray-400">
          {job.createdAt
            ? `${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`
            : ""}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-gray-700 text-sm line-clamp-2">{description.slice(0,50)}</p>

      {/* Salary + Job Type */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-medium">Rs {salary}</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          {jobType}
        </span>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => navigate(`/job/${job._id}`)}
        className="mt-4 w-full bg-cyan-700 text-white py-2 rounded-lg hover:bg-cyan-800 transition cursor-pointer"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
