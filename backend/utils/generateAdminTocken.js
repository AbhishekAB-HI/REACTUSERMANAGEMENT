

const jwt =require('jsonwebtoken');


const generateAdminTocken=(adminId)=>{
    return jwt.sign({ adminId },"admin_secret",{expiresIn:'30d'});
}


  module.exports = generateAdminTocken;
