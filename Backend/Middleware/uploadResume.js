// middleware/uploadResume.js
import multer from "multer";
import path from "path";

// ✅ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes"); // folder name
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "resume-" + Date.now() + path.extname(file.originalname) // resume-123.pdf
    );
  },
});

// ✅ File filter (only PDF, DOC, DOCX allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX files allowed ❌"));
  }
};

const uploadResume = multer({ storage, fileFilter });

export default uploadResume;
