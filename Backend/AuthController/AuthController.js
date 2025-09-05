import User from "../Model/user.js";
import GoogleModel from "../Model/GoogleModel.js";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs"



    
function getRedirectUrl(user) {
  if (!user.profileCompleted) {
    return "/profile";
  }
  if (user.role === "jobseeker") {
    return "/home";
  }
  if (user.role === "employer") {
    return "/dashboard";
  }
  if (user.role === "admin") {
    return "/admin";
  }
  return "/"; // default
}



export const Signup =async(req,res)=>{
try {
    const {name,email,password,role}=req.body;

    const existingUser =await User.findOne({email});
    if (existingUser) {
       return res.status(400).json({message: "User already exists" })
    }

    const hashedpassword = await bcrypt.hash(password,10)

    const newUser = new User({name,email,password:hashedpassword,role})
    await newUser.save();
       const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt",token,{
         httpOnly: true,   // JS can't access
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
     })
     const redirectUrl = getRedirectUrl(newUser);
    res.status(201).json({ message: "User created successfully ✅",token,user: { id: newUser.id, email: newUser.email, role: newUser.role, profileCompleted: newUser.profileCompleted },
      redirectUrl,})
} catch (error) {
       res.status(500).json({ message: "Server error", error: error.message });
}

}

export const Login = async(req,res)=>{
    try {
        const {email,password}=req.body;

     const user = await User.findOne({email})   
     if (!user) {
       return res.status(400).json({message:'User Not Found'})   
     }

     const isMatch = await bcrypt.compare(password,user.password)
     if (!isMatch) {
       return res.status(400).json({message:"Invalid credentials"})
     }

     const token = jwt.sign({id:user.id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     )

     res.cookie("jwt",token,{
         httpOnly: true,   // JS can't access
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
     })

      const redirectUrl = getRedirectUrl(user);

      return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: { 
    id: user.id, 
    email: user.email, 
    role: user.role, 
    profileCompleted: user.profileCompleted 
  },
  redirectUrl,
});
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}


  ////... profile Complete Route ..../////
  // controllers/authController.js

export const CompleteProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user;  
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found from token ❌" });
    }
    const { role, jobseekerProfile, employerProfile } = req.body;

    const updateData = { role, profileCompleted: true };

    if (role === "jobseeker") {
      updateData.jobseekerProfile = jobseekerProfile;
    } else if (role === "employer") {
      updateData.employerProfile = employerProfile;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile completed successfully ✅",
      user: updatedUser,
      redirectUrl: role === "jobseeker" ? "/home" : "/dashboard",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const Logout =(req,res)=>{
    res.clearCookie("jwt")
     res.json({ success: true, message: "Logged out successfully" });
}

export const Googlelogin = async(req,res)=>{
    const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub, email, name, picture } = ticket.getPayload();

    let user = await GoogleModel.findOne({ googleId: sub });

    if (!user) {
      user = new GoogleModel({
        googleId: sub,
        name: name,
        email: email,
        profilePicture: picture,
      });
      await user.save();
    }

    // You can now create a session or JWT for the user here
    // For simplicity, we'll just send the user data back
    res.status(200).json({
      message: 'Authentication successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }

}