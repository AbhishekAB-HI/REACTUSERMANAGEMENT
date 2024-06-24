
const express=require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  userProfile,
  editProfile,
  userLogout,
} = require("../Controllers/userController");


const multer = require("multer");
const path = require("path");
const fs =require('fs');
const { adminLogin } = require("../Controllers/AdminController");
const {loginValidation, registerValidator, editorValidator} = require('../helper/validation')
const  {protect} =require('../middleware/authMiddleware')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});



const upload = multer({ storage: storage });

router.post("/register", upload.single("pic"),registerValidator, registerUser);
router.get("/getData/:id", userProfile);
router.post("/editprofile", upload.single("pic"), editorValidator, editProfile);
router.get("/logout", userLogout);
// router.post("/adminLoginpage", adminLogin)
router.post("/login", loginValidation, authUser);
 

 
 module.exports=router
 