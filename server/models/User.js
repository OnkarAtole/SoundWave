const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:'user'
    },
    favorites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Song"
        }
    ]
},
{
timestamps:true
}
);

module.exports=mongoose.model("User",userSchema);