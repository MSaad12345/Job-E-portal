import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectdb from "./Config/db.js";
import cookieParser from "cookie-parser";
import Router from "./Routes/Routes.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import path from "path"


const app = express();
const PORT= process.env.PORT;

// Middleware
app.use(express.json())
app.use(cors({  origin: "http://localhost:5173", credentials: true,}))
app.use(cookieParser())
app.use(helmet({ crossOriginResourcePolicy: false,}))
app.use(mongoSanitize())
app.use("/api",Router)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  setHeaders: (res, path) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    res.set("Access-Control-Allow-Credentials", "true");
  }
}));
app.use("/uploads/resumes", express.static("uploads/resumes"));


app.get("/",(req,res)=>{
    res.send("Backend server working succuessfully")
})

connectdb().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
}).catch((err)=>{console.log(err)})
