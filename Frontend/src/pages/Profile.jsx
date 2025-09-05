import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Select Your Role
        </h1>

        <div className="space-y-4">
          {/* Jobseeker Button */}
          <button
            onClick={() => navigate("/jobseeker")}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition cursor-pointer"
          >
            I am a Jobseeker
          </button>

          {/* Employer Button */}
          <button
            onClick={() => navigate("/employer")}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            I am an Employer
          </button>
        </div>
      </div>
    </div>
  );
}
