import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + " - " + file.originalname)
  }
})

export const upload = multer({
  storage,
  // file size limit
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  // Check file type
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      // Accept file
      cb(null, true)
    } else {
      // Check error
      cb(new Error("Only pdf files are allowed"), false)
    }
  }
})