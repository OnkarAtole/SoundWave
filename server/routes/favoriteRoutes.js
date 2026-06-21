const express=require('express')
const router=express.Router();

const {protect}=require("../middleware/authMiddleware");

const {addFavorite,removeFavorite,getFavourites}=require("../controllers/favoriteController");

router.post("/:songId",protect,addFavorite);
router.delete("/:songId",protect,removeFavorite);
router.get("/",protect,getFavourites);

module.exports=router;