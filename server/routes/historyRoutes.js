const express=require("express")
const router=express.Router();
const {protect}=require("../middleware/authMiddleware")

const {savedHistory,getHistory}=require("../controllers/historyController");

router.post("/",protect,savedHistory);
router.get("/",protect,getHistory);

module.exports=router;