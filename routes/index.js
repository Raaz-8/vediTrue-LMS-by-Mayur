const multer = require('multer');
const User = require('../models/user');
const path = require('path');

var Storage= multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
  });
  
var upload = multer({
    storage:Storage
  }).single('file');

  router.post('/signup', upload,function(req, res, next) {
    var imageFile=req.file.filename;
   var success =req.file.filename+ " uploaded successfully";
  
   var imageDetails= new uploadModel({
    imagename:imageFile
   });
   imageDetails.save(function(err,doc){
  if(err) throw err;
  
  imageData.exec(function(err,data){
  if(err) throw err;
  res.render('upload-file', { title: 'Upload File', records:data,   success:success });
  });
  
   });
  
    });