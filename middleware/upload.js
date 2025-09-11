import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const avatarsDir = path.join(process.cwd(), "uploads", "avatars");
const kycDir = path.join(process.cwd(), "uploads", "kyc");
const ctradersDir = path.join(process.cwd(), "uploads", "Ctraders");
if (!fs.existsSync(kycDir)) fs.mkdirSync(kycDir, { recursive: true });
if (!fs.existsSync(ctradersDir)) fs.mkdirSync(ctradersDir, { recursive: true });
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
    //  user uploads
// *************************
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, kycDir),
  filename: (req, file, cb) => {
    // Add original file extension to the saved filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// *************************

    if (!fs.existsSync("./uploads/avatars")) {
  fs.mkdirSync("./uploads/avatars", { recursive: true });
}
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    // Add original file extension to the saved filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
// **************************
const imageFileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};


const kycUpload = multer({
  storage: kycStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error("Only images and pdfs are allowed!"));
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: imageFileFilter,
});

    // Admin uploads
// **************************
   if (!fs.existsSync("./uploads/Ctraders")) {
     fs.mkdirSync("./uploads/Ctraders", { recursive: true });
   }
const adminStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/Ctraders"));
  },
  filename: (req, file, cb) => {
    // Add original file extension to the saved filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const adminUpload = multer({
  storage: adminStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: imageFileFilter,
});

export { kycUpload, avatarUpload, adminUpload };
// Usage: import { kycUpload, avatarUpload, adminUpload } from '../middleware/upload.js';
