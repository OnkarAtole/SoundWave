const History=require("../models/History")

const savedHistory=async(req,res)=>{
    try{
        const history=await History.create({
            userId:req.user.id,
            songId:req.body.songId
        });
        res.status(201).json(history);
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}


const getHistory=async(req,res)=>{
    const history=await History.find({
        userId:req.user.id
    }).populate("songId").sort({playedAt:-1}).limit(20);
    res.json(history);
}

module.exports={savedHistory,getHistory}