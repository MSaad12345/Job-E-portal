import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employer", "admin", "jobseeker"],
      default: "jobseeker",
    },
    profileCompleted: {
      type: Boolean,
      default: false, // after signup it’s false
    },
    profileImage: { type: String },
    jobseekerProfile: {
      skills: String,
      desiredJobTitle: String,
      description: String,
    },
    employerProfile: {
      companyName: String,
      companyWebsite: String,
      description: String,
    },
    otp: {
  code: { type: String },
  expiresAt: { type: Date },
},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
