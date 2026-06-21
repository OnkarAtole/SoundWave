const mongoose=require("mongoose");

const historySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    songId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song",
        required:true
    },
    playedAt:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps:true
}
);
module.exports=mongoose.model("History",historySchema);