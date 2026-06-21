const User=require("../models/User");
const addFavorite=async(req,res)=>{
        try{
         const user=await User.findById(
            req.user.id
         );
         const songId=req.params.songId;
         if(user.favorites.includes(songId)){
            return res.status(400).json({message:"Already in favorites"})
         }
         user.favorites.push(songId);

         await user.save();
         res.json({message:"Added to favorites"})
        }catch(error){
            res.status(500).json({
                message:error.message
            });
        }

    }

const removeFavorite = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        user.favorites = user.favorites.filter(
            fav =>
                fav.toString() !== req.params.songId
        );

        await user.save();

        res.json({ message: "Removed from favorites"});

    } catch (error) {

        res.status(500).json({message: error.message});

    }
};


const getFavourites=async(req,res)=>{
    const user=await User.findById(
        req.user.id
    ).populate("favorites");
    res.json(user.favorites);
}

module.exports={addFavorite,removeFavorite,getFavourites}