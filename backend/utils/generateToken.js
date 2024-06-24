
const jwt=require("jsonwebtoken");

 const generateTocken=(id)=>{
    return jwt.sign({id},"session_secret",{expiresIn:"30d"})

 }

 module.exports=generateTocken