import React, { useEffect, useState } from "react";
import Avatar from "../assets/avatar_icon.png";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const JobseekerProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobseekerProfile: { skills: "", desiredJobTitle: "", description: "" },
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/getUser");
      setUser(res.data.user);
      setFormData({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        jobseekerProfile: res.data.user.jobseekerProfile || {
          skills: "",
          desiredJobTitle: "",
          description: "",
        },
      });
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // JobseekerProfile nested fields
    if (["skills", "desiredJobTitle", "description"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        jobseekerProfile: { ...prev.jobseekerProfile, [name]: value },
      }));
    } else {
      // For name and email
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("jobseekerProfile", JSON.stringify(formData.jobseekerProfile));
    if (image) data.append("profileImage", image);

    try {
      const res = await api.put("/updateProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated ✅");
      setUser(res.data.user);
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between text-2xl font-bold mb-4">
        <h2>Your Profile</h2>
        <button onClick={() => navigate("/home")} className="cursor-pointer">
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image */}
        <label htmlFor="avatar" className="cursor-pointer">
          <input
            type="file"
            id="avatar"
            accept="image/png,image/jpeg"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user.profileImage
                ? `http://localhost:5001${user.profileImage}`
                : Avatar
            }
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
          Upload profile image
        </label>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Email */}
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full border rounded-lg px-4 py-2"
        />

        {/* Jobseeker Fields */}
        <input
          type="text"
          name="skills"
          value={formData.jobseekerProfile.skills}
          onChange={handleChange}
          placeholder="Skills"
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="text"
          name="desiredJobTitle"
          value={formData.jobseekerProfile.desiredJobTitle}
          onChange={handleChange}
          placeholder="Desired Job Title"
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          name="description"
          value={formData.jobseekerProfile.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default JobseekerProfile;
