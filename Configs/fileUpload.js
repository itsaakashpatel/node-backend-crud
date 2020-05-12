const fs = require('fs');
const path = require('path');
const multer = require('multer');

//CREATE FILE NAME
function getFileName(file) {
  return file.originalname.split('.')[0].replace(/\s/g, "_") + '_' + Date.now() + '_' + Math.floor( Math.random()*999 ) + 99 + path.extname(file.originalname)
}

//MULTER CONFIG
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      //Check Temp folder is present...
      let profilePicPath = path.join( __dirname , './../Assets/profile_pics')
      if (!fs.existsSync(profilePicPath)) {
          // Create a folder
          fs.mkdirSync(profilePicPath)
          cb(null, './Assets/profile_pics')
      } else
          cb(null, './Assets/profile_pics')
  },
  filename: function (req, file, cb) {
      let key = file.fieldname
      let fileName = getFileName(file)
      //Add key and file name to save into DB
      req.body[key] = fileName
      cb(null, fileName)
  }
})

//FILE FILTER

//CHANGE MIME TYPE ACCORDING TO YOUR NEEDS
const fileMimeTypes = [
  'image/jpeg',
  'image/png'
]

const fileFilter = (req, file, cb) => {
  //CHECK MIME TYPES 
  if (fileMimeTypes.indexOf(`${file.mimetype}`)!== -1) {
      cb(null, true)
  } else {
      cb(new Error('File is not supported!'))
  }
}

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: ( process.env.FILE_SIZE_LIMITS || 5 ) * 1024 * 1024 // WE ARE ALLOWING ONLY 5MB FILES BY DEFAULT
  },
})

module.exports = upload