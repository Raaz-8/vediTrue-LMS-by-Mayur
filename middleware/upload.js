const jwt = require('jsonwebtoken');
const User = require('../models/user');
const multer = require('multer');


var Storage= multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
  
var upload = multer({
    storage:Storage
  }).single('file');

module.exports= upload;