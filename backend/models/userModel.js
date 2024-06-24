const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    isAdmin: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
); 
 

// userSchema.pre('save',async function (next){
//     if(!this.isModified('password')){
//         // if the password is modified it go to next step
//         next()
//     } 
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password,salt)
// })


// userSchema.methods.matchpassword =async function (enteredpassword){
//     return await bcrypt.compare(enteredpassword, this.password);
// }


 


const User = mongoose.model("user", userSchema);

module.exports = User;
