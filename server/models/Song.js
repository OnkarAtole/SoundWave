const mongoose=require('mongoose');
const songSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    album:{
        type:String,
    },
    genre:{
        type:String,
    },
    duration:{
        type:Number,
    },
    coverImage:{
        type:String,
    },
    audioUrl:{
        type:String,
        required:true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},
{
timestamps:true
});

module.exports=mongoose.model("Song",songSchema);