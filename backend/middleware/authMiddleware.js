

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const user =require('../models/userModel');

const protect = asyncHandler(async (res, req, next) => {
    let tocken;
    tocken =req.cookie.jwt;
    if(tocken){
        try {
         const decode = jwt.verify(tocken,process.env.JWT_SECRET);
         req.user = await user.findById( decode.userId ).select('-password')
        } catch (error) {
            res.statusCode(401)
              throw new Error("Not autherised invalid tocken");
        }

    }else{
        res.statusCode(401);
        throw new Error('Not autherised no tocken')
    }

});


 module.exports = protect ;