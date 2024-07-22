
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, "session_secret");
      req.user = await user.findById(decoded.id.user).select("-password");

      if (req.user){
             next();
      }else{
          throw new Error("No user");
      }


    } catch (error) {
      throw new Error("Not autherised invalid tocken");
    }
  } else {
    throw new Error("Not autherised no tocken");
  }
});

module.exports = protect;
