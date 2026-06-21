const Song = require('../models/Song');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (
  filePath,
  folder,
  resourceType
) => {

  // Remove chunk_size for files under 100MB. A single stream upload
  // is much faster because it avoids the network roundtrip overhead of sending multiple chunks.
  const result = await cloudinary.uploader.upload(
    filePath,
    {
      folder,
      resource_type: resourceType,
      timeout: 300000        // 5-minute timeout for slow connections
    }
  );

  return result;
};
const getUploadSignature = async (req, res) => {
  try {
    const { folder } = req.query; // 'songs' or 'covers'
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Params to be signed must match what frontend sends
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folder || "songs",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadSong = async (req, res) => {
  try {
    const {
      title,
      artist,
      album,
      genre,
      audioUrl,
      coverImage
    } = req.body;

    if (!audioUrl) {
      return res.status(400).json({
        message: "Audio URL is required"
      });
    }

    const newSong = await Song.create({
      title,
      artist,
      album,
      genre,
      audioUrl,
      coverImage: coverImage || "",
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: "Song uploaded successfully",
      song: newSong
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }

};

const getSongs = async (req, res) => {

  try {

    const songs =
      await Song.find()
        .sort({
          createdAt: -1
        });

    res.json(songs);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};

const getSong = async (req, res) => {

  try {

    const song =
      await Song.findById(
        req.params.id
      );

    if (!song) {

      return res.status(404).json({
        message:
          "Song not found"
      });

    }

    res.json(song);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const deleteSong = async (req, res) => {

  try {

    const song =
      await Song.findById(
        req.params.id
      );

    if (!song) {

      return res.status(404).json({
        message:
          "Song not found"
      });

    }

    await Song.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Song deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};

const searchSongs = async (
  req,
  res
) => {

  try {

    const keyword =
      req.query.keyword || "";

    const songs =
      await Song.find({

        $or: [

          {
            title: {
              $regex: keyword,
              $options: "i"
            }
          },

          {
            artist: {
              $regex: keyword,
              $options: "i"
            }
          },

          {
            album: {
              $regex: keyword,
              $options: "i"
            }
          }

        ]

      });

    res.json(songs);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  getUploadSignature,
  uploadSong,
  getSongs,
  getSong,
  deleteSong,
  searchSongs
};



// const song=require('../models/Song');
// const cloudinary=require('../config/cloudinary');
// const streamifier=require('streamifier');

// const uploadToCloudinary=(buffer,folder,resourceType)=>{
//     return new Promise((resolve,reject)=>{
//         const uploadStream=cloudinary.uploader.upload_stream({folder,resource_type:resourceType},(error,result)=>{
//             if(error){
//                 reject(error);
//             }else{
//                 resolve(result);
//             }
//         }
//     );
//     streamifier.createReadStream(buffer).pipe(uploadStream);
//     });
// }


// const uploadSong=async(req,res)=>{
//     try{
//         const {title,artist,album,genre}=req.body;
//         if(!req.files.audioFile){
//             return res.status(400).json({message:"Audio file is required"});
//         }
//         const audioUpload=await uploadToCloudinary(req.files.audioFile[0].buffer,"songs","video");
//         let coverurl="";
//         if(req.files.coverImage){
//             const coverUpload=await uploadToCloudinary(req.files.coverImage[0].buffer,"covers","image");
//             coverurl=coverUpload.secure_url;
//         }
//         // coverUrl=imageUpload.secure_url;
//         const newSong=await song.create({
//             title,
//             artist,
//             album,
//             genre,
//             audioUrl:audioUpload.secure_url,
//             coverImage:coverurl,
//             uploadedBy:req.user.id
//         });
//         res.status(201).json({message:"Song uploaded successfully",song:newSong});
//     }catch(error){
//         console.error(error);
//         res.status(500).json({message:error.message});
//     }

// }

// const getSongs=async(req,res)=>{
//     try{
//         const songs=await song.find().sort({createdAt:-1});
//         res.json(songs);
//     }catch(error){
//         console.error(error);
//         res.status(500).json({message:error.message});
//     }
// }

// const getSong=async(req,res)=>{
//     const song=await song.findById(req.params.id);
//     if(!song){
//         return res.status(404).json({message:"Song not found"});
//     }
//     res.json(song);
// }

// const deleteSong=async(req,res)=>{
//     try{
//         const song=await song.findById(req.params.id);
//         if(!song){
//             return res.status(404).json({message:"Song not found"});
//         }
//         await song.remove();
//         res.json({message:"Song deleted successfully"});
//     }catch(error){
//         console.error(error);
//         res.status(500).json({message:error.message});
//     }
// }

// const searchSongs=async(req,res)=>{
//     try{
//         const keyword=req.query.keyword ||"";
//         const songs=await song.find({
//             $or:[
//                 {
//                     title:{$regex:keyword,
//                         $options:"i"
//                     }
//                 },
//                 {
//                 artist:{
//                     $regex:keyword,
//                         $options:"i"
//                 }
//                 },
//                 {
//                 album:{
//                     $regex:keyword,
//                         $options:"i"
//                 }
//             }
//             ]
//         });
//         res.json(songs);
//     }catch(error){
//         res.status(500).json({message:error.message})
//     }
// }

// module.exports={uploadSong,getSongs,getSong,deleteSong,searchSongs};