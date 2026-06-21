const express=require('express');
const router=express.Router();

const {protect}=require("../middleware/authMiddleware");

const {createPlayList,getPlaylists,addSong,removeSong,deletePlaylist}=require("../controllers/playlistController");

router.post("/",protect,createPlayList);
router.get("/",protect,getPlaylists);
router.post("/:id/add-song",protect,addSong);
router.delete("/:id/remove-song/:songId",protect,removeSong);
router.delete("/:id",protect,deletePlaylist);
router.get("/:id",protect,getPlaylists)

module.exports=router;