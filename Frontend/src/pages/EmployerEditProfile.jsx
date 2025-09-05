// EmployerProfile.jsx
import React, { useEffect, useState } from "react";
import Avatar from "../assets/avatar_icon.png"
import api from "../Api";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const EmployerProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email:"",
    employerProfile: { companyName: "", companyWebsite: "", description: "" },
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/Getuser");
      setUser(res.data.user);
      setFormData({
        name: res.data.user.name || "",
        email:res.data.user.email || "",
        employerProfile: res.data.user.employerProfile || {
          companyName: "",
          companyWebsite: "",
          description: "",
        },
      });
      console.log(res.data.user.email)
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      employerProfile: { ...prev.employerProfile, [name]: value },
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("employerProfile", JSON.stringify(formData.employerProfile));
    if (image) data.append("profileImage", image);

    try {
      const res = await api.put("/updateProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated ✅");
      setUser(res.data.user);
      navigate("/dashboard")
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <div className="flex justify-between text-2xl font-bold mb-4">
      <h2>Profile Details</h2>
         <button onClick={()=>navigate("/home")} className="cursor-pointer"><X/></button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
       <label htmlFor="avatar" className="">
            <input type="file" id="avatar" accept="png,jpeg,jpej" hidden onChange={(e)=>setImage(e.target.files[0])} />
            <img src={image? URL.createObjectURL(image) : Avatar} alt="" className="h-20 w-20 rounded-full"/>
            Upload profile image
          </label>
          <br />
        <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" className="w-full border rounded-lg px-4 py-2" />
        <input type="text" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Your Email" className="w-full border rounded-lg px-4 py-2" />
        <input type="text" name="companyName" value={formData.employerProfile.companyName} onChange={handleChange} placeholder="Company Name" className="w-full border rounded-lg px-4 py-2" />
        <input type="text" name="companyWebsite" value={formData.employerProfile.companyWebsite} onChange={handleChange} placeholder="Company Website" className="w-full border rounded-lg px-4 py-2" />
        <textarea name="description" value={formData.employerProfile.description} onChange={handleChange} placeholder="Company Description" rows={4} className="w-full border rounded-lg px-4 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Update Profile</button>
      </form>
    </div>
  );
};

export default EmployerProfile;
