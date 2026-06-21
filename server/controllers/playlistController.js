const Playlist=require("../models/PlayList");
// const createPlayList=async(req,res)=>{

//     try{
//         const playlist=await Playlist.create({
//             name:req.body.name,
//             userId:req.user.id,
//         });
//         res.status(201).json(playlist);
//     }catch(error){
//         res.status(500).json({
//             message:error.message,
//         })
//     }
// }
const createPlayList = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    try {
        const playlist = await Playlist.create({
            name: req.body.name,
            userId: req.user.id,
        });

        res.status(201).json(playlist);
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
}

const getPlaylists=async(req,res)=>{
    const playlists=await Playlist.find({
        userId:req.user.id,
    }).populate("songs");
    res.json(playlists);
}

const addSong=async(req,res)=>{
    const playlist=await Playlist.findById(req.params.id);

    if(!playlist){
        return res.status(404).json({message:"playlist not found"})
    }
    
    playlist.songs.push(req.body.songId);

    await playlist.save();

    res.json({message:"song added successfully"})
}


const removeSong=async(req,res)=>{
    const playlist=await playlist.findById(req.params.id)

    playlist.songs=playlist.songs.filter((song)=>{
        return song.toString()!==req.params.songId
    })

    await playlist.save();

    res.json({
        message:"song removed",
    })
}

const deletePlaylist=async(req,res)=>{
    const playlist=await playlist.findById(req.params.id);

    if(!playlist){
        return res.status(404).json({message:"playlist not found"});

    }

    await playlist.deleteOne();

    res.json({message:"playlist deleted"})
}



module.exports={createPlayList,getPlaylists,addSong,removeSong,deletePlaylist}