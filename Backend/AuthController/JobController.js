import JobModel from "../Model/JobModel.js"
import nodemailer from "nodemailer";



export const getJobs = async (req, res) => {
  try {
    const { company, location, jobType, status, minSalary, maxSalary, keyword } = req.query;

    // Base filter
    let filter = {};

    if (req.user.role === "employer") {
      filter.createdBy = req.user.id;
    }

   

    if (company) filter.company = { $regex: company, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (status) filter.status = status;
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
      ];
    }
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    // Fetch jobs
    const jobs = await JobModel.find(filter).sort({ createdAt: -1 });

    // Stats
    const totalJobs = await JobModel.countDocuments(filter);
    const jobTypeStats = await JobModel.aggregate([
      { $match: filter },
      { $group: { _id: "$jobType", count: { $sum: 1 } } },
    ]);
    const statusStats = await JobModel.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      totalJobs,
      stats: {
        jobTypeStats,
        statusStats,
      },
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found ❌" });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const SearchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    // base search query
    let query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };

    
      if (userRole === "employer") {
      query = {
        ...query,
        createdBy: userId, 
      };
    }

    const jobs = await JobModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const Createjob = async(req,res)=>{
    try {
        const {title,description,requirements,salary,location,jobType,company,} = req.body;

        
    if (!company || !title || !description || !requirements) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

        const newJob = new JobModel({title,description,requirements,salary,location,jobType,company, createdBy: req.user.id})
        await newJob.save();
         res.status(201).json({ success: true, message: "Job created successfully ✅", job:newJob });

    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const UpdateJob = async(req,res)=>{
  try {
    const {jobId} = req.params;

    const job = await JobModel.findById(jobId);
    if (!job) {
         return res.status(404).json({ success: false, message: "Job not found ❌" });
    }

    const updatedjob = await JobModel.findByIdAndUpdate(jobId,req.body,{new:true})
     res.status(200).json({ success: true, message: "Job updated ✅", job: updatedjob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

export const DeleteJob = async(req,res)=>{
    try {
        const {jobId} = req.params;
        const Job = await JobModel.findById(jobId);
        if (!Job) {
            return res.status(404).json({ success: false, message: "Job not found ❌" });
        }
       
        await JobModel.findByIdAndDelete(jobId);
          res.status(200).json({ success: true, message: "Job deleted ✅" });
    } catch (error) {
          res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


export const ApplyJob = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    const resumeFile = req.file;

    const job = await JobModel.findById(jobId).populate("createdBy");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Employer email (jisne job post kiya tha)
    const employerEmail = job.createdBy.email;

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email with resume attached
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.SMTP_USER}>`, // fixed from
      to: employerEmail,
      replyTo: email, // 👈 applicant ka email yahan
      subject: `New Job Application for ${job.title}`,
      text: `Applicant Email: ${email}\nApplied for: ${job.title}`,
      attachments: [
        {
          filename: resumeFile.originalname,
          path: resumeFile.path,
        },
      ],
    });

    res.status(200).json({ success: true, message: "Application sent successfully" });
  } catch (error) {
    console.error("Apply Job Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
