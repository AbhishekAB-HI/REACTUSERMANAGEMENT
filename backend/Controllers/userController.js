const express = require("express");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const cloudinary = require("../Cloudinary");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const generateTocken = require('../utils/generateToken')

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const registerUser = asyncHandler(async (req, res) => {
  try{

  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        validation: true,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

  const { name, email, password } = req.body;

 

  const userExist = await User.findOne({ email });

  if (userExist) {
     return res.status(200).json({ success: false, message: "User already exists" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  let profilePicUrl = null;
  const result = await cloudinary.uploader.upload(req.file.path);

  const user = new User({
    name: name,
    email: email,
    password: hashpassword,
    profilePic: result.secure_url,
  });
   await user.save();
   if(user){
     const accessToken = await generateTocken({ user: user._id });
       let value = res.status(200).json({ success: true }); 
   }
  }catch(error){
    console.log(error.message);
  }
});





// const generateAccessToken = async (user) => {
//   try {
//     return jwt.sign(user, "my_access_key_token", { expiresIn: "2h" });
//   } catch (error) {
//     console.error("Error generating token:", error);
//     throw new Error("Token generation failed");
//   }
// };



// const generateRefreshToken = async (user) => {
//   try {
//     return jwt.sign(user, "my_access_key_token", { expiresIn: "1y" });
//   } catch (error) {
//     console.error("Error generating token:", error);
//     throw new Error("Token generation failed");
//   }
// };

const authUser = asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .json({
            success: false,
            validation: true,
            message: "Validation errors",
            errors: errors.array(),
          });
      }
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) { 
    console.log("false");
    return res
      .status(200)
      .json({ success: false, message: "No user found" });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(200)
      .json({ success: false, message: "Invalid Username or Password" });
  }
  const accessToken = await generateTocken({ user: user._id });

   console.log(accessToken,"tocken here");
  res.status(200).json({ success: true,accessToken,userDetails: user});
      
    } catch (error) {
      console.log(error.message);
    }
});

 
 const userProfile= async (req,res)=>{
    try {
       const userid = req.user._id ||"";
       const userData=   await User.findOne({ _id: userid });
        return res.json(userData);
    } catch (error) {
     console.log(error.message);
    }
 }
 
const editProfile = async (req, res) => {

  try {

    const { name, email, password } = req.body;
     const id = req.user._id || "";
  
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
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findById(id);

    console.log(user,'modifirwddqd');

    user.name = name;
    user.email = email;
    user.password = hashpassword; 
    user.profilePic = result.secure_url;

   
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}





 const userLogout=(req,res)=>{
   try {
    res.cookie('jwt','',{
      httpOnly:true,
      expires:new Date(0)
    })
    
   return res.status(200).json({ success:true });

   } catch (error) {
    console.log(error.message);
   }

 }

  const CheckuserExist = async(req, res) => {
    try {
 
     const userid = req.user._id || "";
     console.log(userid,'user id get ');
     const userData = await User.findOne({ _id: userid });
    if (userData) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
    } catch (error) {
      console.log(error.message);
    }
  };





module.exports = {
  registerUser,
  authUser,
  userProfile,
  editProfile,
  userLogout,
  CheckuserExist,
};
