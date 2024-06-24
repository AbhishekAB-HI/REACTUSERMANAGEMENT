
const User= require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const { validationResult } = require("express-validator");
const cloudinary = require("../Cloudinary");


 


const generateAccessToken = async (user) => {
  try {
    return jwt.sign(user, "my_admin_key_token", { expiresIn: "2h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};


const generateRefreshToken = async (user) => {
  try {
    return jwt.sign(user, "my_admin_key_token", { expiresIn: "1y" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};


const adminLogin = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        validation: true,
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email, isAdmin: 1 });

    if (!userData) {
      return res
        .status(200)
        .json({ success: false, message: "No user found " });
    }

 
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });
    }

    const accessToken = await generateAccessToken({
      userData: userData._id,
    });


    const refreshToken = await generateRefreshToken({
      userData: userData,
    });
    
    return res.status(200).json({ success: true, accessToken, refreshToken });

  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


 const admindashboard =async(req,res)=>{
   try {

     const usersList =await User.find();
     res.status(200).json({ status: true, usersList });
   } catch (error) {
    console.log(error.message);
   }

 }

  

   const valueadmindashboard=(req,res)=>{
    try {
      const adminId = req.params.adminId;
      console.log(adminId,'pppppppppppppppp');


      
    } catch (error) {
       console.log(error.message);
    }
   }

   
 const getUserById = async (req, res) => {
   try {
     const user = await User.findById(req.params.id);
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     res.json({ user });
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };

 const updateUser = async (req, res) => {
   try {

    const {name,email,password}=req.body;
    const errors = validationResult(req);

     if (!errors.isEmpty()) {
       return res.status(200).json({
         success: false,
         validation: true,
         message: "Validation errors",
         errors: errors.array(),
       });
     }
    const hashpassword = await bcrypt.hash(password, 10);
     const user = await User.findById(req.params.id);
     if (!user) {
       return res.status(404).json({ message: "User not found" });

     }



      const result = await cloudinary.uploader.upload(req.file.path);

     
     user.name = name || user.name;
     user.email = email || user.email;
     if (password) {
       user.password = hashpassword; 
     }
     if (req.file) {
       user.profilePic = result.secure_url;
     }
     await user.save();
    
     res.json({ success:true, user });
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };


  const deleteUserid=async(req,res)=>{
    try {

       console.log("ooooooooooooooooooo");
      const user = await User.findByIdAndDelete(req.params.id);
      console.log(user,'llllllllllllllllllllllll');
      if(user){
      return  res.status(200).json({success:true})
      }else{
      return   res.json({ success: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

   const deleteAdminid =(req,res)=>{
    try {
       return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
    }
   }









module.exports = {
  adminLogin,
  admindashboard,
  deleteUserid,
  valueadmindashboard,
  getUserById,
  updateUser,
  deleteAdminid
};