const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  adminLogin,
  admindashboard,
  valueadmindashboard,
  getUserById,
  updateUser,
  deleteUserid,
  deleteAdminid,
  blockUser,
} = require("../Controllers/AdminController");
const { AdminloginValidation, editAdminuserValidator } = require("../helper/validation");
 


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

// Define routes
router.post("/adminLoginpage", AdminloginValidation, adminLogin);
router.get("/admindashboardget", admindashboard);
// router.post("/editAdminUser", upload.single("pic"), editadmindashboard);

// Get user data for editing
router.get("/getAdminUser/:id", getUserById);
// Update user data 
router.post("/editAdminUser/:id", upload.single("pic"),editAdminuserValidator, updateUser);
router.post("/deleteUser/:id", deleteUserid);

router.post("/blockUser/:blockid",blockUser);
router.get("/adminlogout",deleteAdminid);

module.exports = router;




