const router = require("express").Router();
//I want to use the usermodel here
const User = require("../models/User");

//bcrypt password
const bcrypt=require("bcrypt")

//REGISTER  change from get to post after verifying with Mongodb
router.post("/register", async (req, res)=>{
    //take information from client side
    //router.get"/register", async (req, res)=>{
    //const user = await new User({
        //username: "sam",
        //email: "samuelbabu1994@gmail.com",
        //password:"helen"
    //})
    //save this user
   //await user.save()
   //res.send("ok")
   //USE POSTMAN HERE VERY IMPORTATN TO GO STEP BY STEP
   
   //now use try and catch method
   try{
       //hashing password
       const hash = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(req.body.password, hash)

       //new user
       const newUser=new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
       
       })
       //save ser and return response
       const user = await newUser.save();
       res.status(200).json(user);
    } catch (err){
        res.status(500).json(err)
        //console.log(err)
    }
});



//LOGIN
router.post("/login", async (req, res)=>{
    try{
    const user =await User.findOne({username:req.body.username});
    //and if there is no user like username
    !user && res.status (404).json("user not registered");

    const validPassword = bcrypt.compare(req.body.password, user.password)
    //if password is not valid, it will send again
    !validPassword && res.status(400).json("wrong password entered")
    res.status(200).json(user)

    }catch(err){
        res.status(500).json(err)
        //console.log(err);
    }
})

//we will use this route for our users like update, getall etc
//router.get("/", (req, res)=>{
    //res.send("AUTH Route")
//})

module.exports = router