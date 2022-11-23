//call the mongoose
const mongoose=require("mongoose")

//first build a userschema and inside the Obj we create our params
const UserSchema =new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min:3,
        max:16,
        unique:true
    },
    email:{
        type:String,
        require: true,
        max: 30,
        unique: true,
    },
    password:{
        type: String,
        require: true,
        min: 7
    },
    profilePic:{
        type:String,
        // empty string for adding users
        default:""
    },
    coverPic:{
        type:String,
        // empty string for adding users
        default:""
    },
    followers:{
        type:Array,
        default: []
    },
    following:{
        type:Array,
        default: []
    },
    Admin:{
        type:Boolean,
        default:false,
    },
    desc: {
        type: String,
        max: 50,
      },
      currentcity: {
        type: String,
        max: 30,
      },
      nexttimeinIndia: {
        type: String,
        max: 30,
      },
      familytreeRelation: {
        type: Number,
        //some options 
        enum: [1, 2, 3, 4, 5],
      },
},
    //we can also put a timestamp when a user is created.
    {timestamps: true}

);
//model name User and UserSchema export
module.exports = mongoose.model("User", UserSchema );