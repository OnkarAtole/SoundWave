// const multer=require('multer');
// const storage=multer.memoryStorage();
// const upload=multer({storage});

// module.exports=upload;

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: function(req,file,cb){
      cb(null,"uploads/");
  },

  filename: function(req,file,cb){
      cb(
        null,
        Date.now() +
        path.extname(file.originalname)
      );
  }

});

const upload = multer({

  storage,

  limits:{
      fileSize:
      50 * 1024 * 1024
  }

});

module.exports = upload;