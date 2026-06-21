const User=require("../models/User");
const Song=require("../models/Song");
const Playlist=require("../models/PlayList");
const History=require("../models/History");

const getDashboardStats=async(req,res)=>{

    try{
        const totalUsers=await User.countDocuments();
        const totalSongs=await Song.countDocuments();
        const totalPlaylists=await Playlist.countDocuments();
        const totalPlays=await History.countDocuments();
        res.json({
            totalUsers,
            totalSongs,
            totalPlaylists,
            totalPlays
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}


const getTopSongs=async(req,res)=>{
    const topSongs=await History.aggregate([
        {
            $group:{
                _id:"$songId",
                playCount:{
                    $sum:1
                }
            }
        },
        {
          $lookup:{
            from:"songs",
            localField:"_id",
            foreignField:"_id",
            as:"song"
          }
        },
        {
          $unwind:"$song"
        },
        {
            $sort:{
                playCount:-1
            }
        },
        {
            $limit:5
        }
    ]);
    res.json(topSongs);
}


const getTopArtists=async(req,res)=>{
    const artists=await History.aggregate([
        {
          $lookup:{
            from:"songs",
            localField:"songId",
            foreignField:"_id",
            as:"song"
          }
        },
        {
          $unwind:"$song"
        },
        {
            $group:{
                _id:"$song.artist",
                playCount:{
                    $sum:1
                }
            }
        },
        {
            $sort:{
                playCount:-1
            }
        },
        {
            $limit:5
        }
    ])
    res.json(artists);
}

const getRecentSongs=async(req,res)=>{
    const songs=await Song.find().sort({
        createdAt:-1
    }).limit(10);
    res.json(songs);
}

module.exports={getDashboardStats,getTopSongs,getTopArtists,getRecentSongs}