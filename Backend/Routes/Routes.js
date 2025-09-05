import express from 'express'
import { Signup,Login,Logout, Googlelogin,CompleteProfile } from '../AuthController/AuthController.js';
import { getUser, PasswordReset, SendOtp, updateProfile, VerifyOtp } from '../AuthController/Usercontroller.js';
import verifyToken from '../Middleware/AuthMiddleware.js'
import upload from '../Middleware/upload.js';
import { Createjob, DeleteJob, getJobs,getJobById ,SearchJobs, UpdateJob,ApplyJob } from '../AuthController/JobController.js';
import rateLimit from "express-rate-limit";
import { roleCheck } from "../Middleware/RolecheckMiddleware.js";
import uploadResume from '../Middleware/uploadResume.js';




const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per 15min
  message: "Too many requests, try again later."
});

const Createjoblimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per 15min
  message: "Too many requests, try again later."
});


const Router =express.Router();

Router.post("/Signup",limiter,Signup)
Router.post("/Login",limiter,Login)
Router.post("/Googlelogin",limiter,Googlelogin)
Router.post("/Logout",Logout)
///.. profile Complete  Route...//
Router.put("/profile",verifyToken,limiter,CompleteProfile)


/// getUser Routes /////

Router.get("/Getuser",verifyToken,getUser)
Router.put("/updateProfile", upload.single("profileImage"),verifyToken,updateProfile)


//////....Password Forget .....//////
Router.post("/sendotp",SendOtp)
Router.post("/verifyotp",VerifyOtp)
Router.post("/passwordreset",PasswordReset)


/////Jobs Routes ////

Router.get("/Getjobs", verifyToken,getJobs)
Router.get("/Getjob/:jobId", verifyToken, roleCheck(["admin", "employer"]), getJobById);
Router.get("/Getjobid/:jobId", getJobById);
Router.post("/applyJob", uploadResume.single("resume"),ApplyJob );
Router.post("/Createjob",verifyToken,roleCheck(["admin", "employer"]),Createjoblimit,Createjob)
Router.put("/Updatejob/:jobId", verifyToken,roleCheck(["admin", "employer"]), UpdateJob);
Router.delete("/deletejob/:jobId", verifyToken,roleCheck(["admin", "employer"]), DeleteJob);
Router.get("/Searchjob",verifyToken,SearchJobs)



export default Router