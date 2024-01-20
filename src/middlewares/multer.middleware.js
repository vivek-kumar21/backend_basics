import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");   // this is the path where we store the files locally
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);    // this indicates that we get the filenames as it is uploaded 
  },
});

export const upload = multer({ storage });
