import multer from "multer"
import path from 'path'

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{cb(null,"uploads/")},
//     filename:(req,file,cb)=>{
//         cb(null,Date.now() + path.extname(file.originalname))
//     }
// })

// // File filter — allow only mp3
// const fileFilter = (req, file, cb) => {
//   const allowed = ["audio/mpeg", "audio/mp3"];

//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only MP3 files are allowed!"), false);
//   }
// };

// // Create multer upload
// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });


const fileFilter = (req, file, cb) => {
  const allowed = ["audio/mpeg", "audio/mp3"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .mp3 files are allowed"), false);
  }
};



const storage = multer.memoryStorage()

const upload = multer({ storage, fileFilter });

export default upload

// // temporary local folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");        // this folder must exist
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
