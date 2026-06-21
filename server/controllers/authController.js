const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existinguser=await User.findOne({email:email});
        if(existinguser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newuser=await User.create({
             name:name,
             email:email,
             password:hashedPassword,
        });
        res.status(201).json({message:"User registered successfully"});


    }catch(error){
        return res.status(500).json({message:"server error"});
    }

}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existinguser=await User.findOne({email:email});
        
        if(!existinguser){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const ispasswordMatch=await bcrypt.compare(password,existinguser.password);

        if(!ispasswordMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=jwt.sign({id:existinguser._id,role:existinguser.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
       
        // res.status(200).json({token,message:"Login successful"});
        res.status(200).json({
    token,

    user: {
        id: existinguser._id,
        name: existinguser.name,
        email: existinguser.email,
        role: existinguser.role
    },

    message: "Login successful"
});

    }catch(error){
          console.error(error);
        return res.status(500).json(
            {message:"server error"}
        );
    }
}



const getProfile=async(req,res)=>{
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);
}


module.exports={registerUser, loginUser, getProfile};