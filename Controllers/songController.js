import cloudinary, { uploadToCloudinary } from "../config/cloudinaryconfig.js";
import { songModel } from "../Models/songModel.js";
import streamifier from "streamifier"

// MP3 uploader
const uploadSongToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "songs",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Image uploader

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "song-images",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// addsong Controller

export const addsong = async (req, res) => {
  try {
    if (!req.files?.file || !req.files?.image) {
      return res.status(400).json({
        error: "Please upload both song and image",
      });
    }

    const { title, artist } = req.body;

    const alreadyexist = await songModel.findOne({ title, artist });
    if (alreadyexist) {
      return res.status(200).json({
        message: "This song already exists",
        data: alreadyexist,
      });
    }

    // 🎵 Parallel Uploads (Much Faster!)
    const [songUrl, imageUrl] = await Promise.all([
      uploadSongToCloudinary(req.files.file[0].buffer),
      uploadImageToCloudinary(req.files.image[0].buffer)
    ]);

    const song = await songModel.create({
      title,
      artist,
      filePath: songUrl,
      imagePath: imageUrl,
    });

    res.status(201).json({
      message: "Song uploaded successfully",
      data: song,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Song upload failed" });
  }
};





// const uploadBufferToCloudinary = (buffer)=> {
//     return new Promise((resolve,reject)=>{
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 resource_type:"video",folder:"songs"
//             },
//             (error,result)=>{
//                 if(error)
//                     return reject(error)
//                     resolve(result)
//             }
//         )
//         streamifier.createReadStream(buffer).pipe(stream)
//     })
// }



// export const addsong = async (req,res)=>{
//     try {

//         if(!req.file){
//             return res.status(400).json({error:"please upload an MP3 file"})
//         }

//         const{title,artist}=req.body

//         const alreadyexist = await songModel.findOne({title,artist})

//         if (alreadyexist) {
//             return res.status(201).send({message:"this song is already existed",data:alreadyexist})
//         }

//         console.log("hayyy",req.file.path);
//         console.log("bufferrr",req.file);

//         const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);


//         if(!cloudinaryUrl){
//             return res.status(500).json({error:"cloudinary upload failed!!"})
//         }

//         const song = await songModel.create({
//             title: req.body.title,
//             artist: req.body.artist,
//             filePath: cloudinaryUrl,
//         })
//         console.log("song added",song);

//         res.status(201).send({message:"file uploaded succesfully!!",data: song})


//     } catch (error) {
//         console.log(error);
//         res.status(404).send("song doesn`t added !!")

// }
// }


export const getsongs = async (req, res) => {
  try {
    const getsong = await songModel.find()
    console.log(getsong);

    res.status(200).send({ message: "all songs ", data: getsong })

  } catch (error) {
    console.log("errorr", error);

  }
}



export const getAllsongs = async (req, res) => {
  try {

    const { id } = req.params
    const getAllsong = await songModel.findById(id)
    console.log(getAllsong);

    res.status(200).send({ message: "all songs ", data: getAllsong })

  } catch (error) {
    console.log("errorr", error);

  }
}