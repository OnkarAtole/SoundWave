const express=require('express');
const app=express();

const cors=require('cors');
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
const PORT=process.env.PORT || 5000;


// database connection
const connectDB=require('./config/db');
connectDB();



const authRoutes=require('./routes/authRoutes');
app.use("/api/auth",authRoutes);

const songRoutes=require('./routes/songRoutes');
app.use("/api/songs",songRoutes);

const playlistRoutes=require("./routes/playlistRoutes");
app.use("/api/playlists",playlistRoutes);


const favoriteRoutes=require("./routes/favoriteRoutes");
app.use("/api/favorites",favoriteRoutes);


const  historyRoutes=require("./routes/historyRoutes");
app.use("/api/history",historyRoutes);

const dashboardRoutes=require("./routes/dashboardRoutes");
app.use("/api/dashboard",dashboardRoutes);

app.get('/',(req,res)=>{
    res.send("Media player server is running");
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});