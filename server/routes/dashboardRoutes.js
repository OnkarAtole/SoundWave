const express=require("express");
const router=express.Router();

const {protect,admin}=require("../middleware/authMiddleware");
const {getDashboardStats,getTopSongs,getTopArtists,getRecentSongs}=require("../controllers/dashboardController");

router.get("/stats",protect,admin,getDashboardStats);

router.get("/top-songs",protect,admin,getTopSongs);
router.get("/top-artists",protect,admin,getTopArtists);
router.get("/recent-songs",protect,admin,getRecentSongs);

module.exports=router;
