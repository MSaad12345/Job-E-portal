import User from "../Model/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const getUser = async (req,res)=>{
    try {
         const user = req.user;
        // const user = await User.findById(userId)
        if (!user) {
             return res.status(404).json({ message: "User not found" });
        }
         res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}




// controllers/UserController.js
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update text fields
    if (user.role === "jobseeker") {
      const { name,email, jobseekerProfile } = req.body;
      user.name = name || user.name;
      user.email =email || user.email
      user.jobseekerProfile = { ...user.jobseekerProfile, ...JSON.parse(jobseekerProfile) };
      user.profileCompleted = true;
    } else if (user.role === "employer") {
      const { name,email, employerProfile } = req.body;
      user.name = name || user.name;
       user.email =email || user.email
      user.employerProfile = { ...user.employerProfile, ...JSON.parse(employerProfile) };
      user.profileCompleted = true;
    }

    // Update image
    if (req.file) user.profileImage = `/uploads/images/${req.file.filename}`;

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const SendOtp = async(req,res) =>{
   try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const generateOtp = () => {
  if (crypto.randomInt) {
    return crypto.randomInt(100000, 999999).toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

     const otp = generateOtp();
    // Save OTP in DB with expiry (5 min)
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to your email ✅" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const VerifyOtp =async(req,res)=>{
    try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP ❌" });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired ❌" });
    }

    res.json({ success: true, message: "OTP verified ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const PasswordReset =async(req,res)=>{
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP ❌" });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired ❌" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP
    user.otp = { code: null, expiresAt: null };

    await user.save();

    res.json({ success: true, message: "Password reset successful ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    console.log("ResetPassword Error:", error.message);

  }
}