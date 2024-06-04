
const express=require("express");

const app=express();
const dotenv=require("dotenv");

  dotenv.config()

// create server

 app.get("/",(req,res)=>{
    res.send("api is send")
 })

 const PORT =process.env.PORT || 5000 

app.listen(PORT, console.log("Server start at port 5000"));