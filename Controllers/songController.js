import cloudinary from "../config/cloudinaryconfig.js";
import { songModel } from "../Models/songModel.js";
import { fetchJamendoTracks } from "../config/jamendoconfig.js";
import { fetchAudiusTracks } from "../config/audiusconfig.js";

// Vercel serverless functions cap request bodies at ~4.5MB, so audio/image
// files can't be uploaded through this backend. The frontend instead uploads
// directly to Cloudinary using a signature from this endpoint, and only
// sends us the resulting URLs.
export const getUploadSignature = async (req, res) => {
  try {
    const { folder } = req.body;
    if (!folder) {
      return res.status(400).json({ error: "folder is required" });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD,
      folder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate upload signature" });
  }
};

// addsong Controller

export const addsong = async (req, res) => {
  try {
    const { title, artist, filePath, imagePath } = req.body;

    if (!title || !artist || !filePath || !imagePath) {
      return res.status(400).json({
        error: "Please provide title, artist, filePath and imagePath",
      });
    }

    const alreadyexist = await songModel.findOne({ title, artist });
    if (alreadyexist) {
      return res.status(200).json({
        message: "This song already exists",
        data: alreadyexist,
      });
    }

    const song = await songModel.create({
      title,
      artist,
      filePath,
      imagePath,
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


// External tracks (e.g. Jamendo, Audius) use a synthetic id like
// "jamendo-168" or "audius-AxPQgQ0" and aren't real songModel documents, but
// playlist.songs stores ObjectId refs. This gets-or-creates a local record
// so the track can be referenced there.
export const upsertExternalSong = async ({ externalId, title, artist, filePath, imagePath }) => {
  return songModel.findOneAndUpdate(
    { externalId },
    { externalId, title, artist, filePath, imagePath },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

export const getsongs = async (req, res) => {
  try {
    const [getsong, jamendoSongs, audiusSongs] = await Promise.all([
      songModel.find(),
      // Don't let an external API outage take down the whole songs list.
      fetchJamendoTracks({ limit: 30 }).catch((error) => {
        console.log("jamendo fetch failed", error);
        return [];
      }),
      fetchAudiusTracks({ limit: 30 }).catch((error) => {
        console.log("audius fetch failed", error);
        return [];
      }),
    ])

    res.status(200).send({ message: "all songs ", data: [...getsong, ...jamendoSongs, ...audiusSongs] })

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