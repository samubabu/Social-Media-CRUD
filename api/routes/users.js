const User =require("../models/User");
const bcrypt =require("bcrypt")
const router = require("express").Router();



//update user 
//:id is a param and whether id is admin or not
router.put("/:id", async(req, res)=>{
    //verify if the user-id doesnt match with the above id, we will return some error
    if (req.body.userId ===req.params.id || req.body.Admin){
        if(req.body.password){
            //if user try to update password then we try to 
            try{
                const hash = await bcrypt.genSalt(10);

                req.body.password = await bcrypt.hash(req.body.password, hash)
            }catch(err){
                return res.status(500).json(err)
            }
        }

        //Now UPDATE THE ACTUAL USER
        try{
            const user =await User.findByIdAndUpdate(req.body.userId, {
                //automatically set all inputs inside this body below
                $set:req.body, 
            });
            res.status(200).json("Your Account has been updated")
        }
        catch(err){
            return res.status(500).json(err);
        }

    }else{
        return res.status(401).json("Only your account can be updated unless Admin")
    }
})
//so our api localhost/users?userId or write username sam
//get a user
router.get("/:id", async (req, res) => {
  //const userId =req.query.userId;
    //const userId = req.params.userId;
    //console.log(userId)
    //const username = req.query.username;
    try {
      // write a condition here; if there is userid call the below func
      //const user=userId
      //const user=userId ? await User.findById(userId): await User.findOne({username:username});
      const user = await User.findById(req.params.id)
       
        //: await User.findOne({ username: username });
        //create some objects and user.doc carrys all the object of the userid
      const  { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//add a family member
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });

//follow a user

router.put("/:id/follow", async (req, res) => {
    //verify body userid is same as param userid, then its same user so no follow
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
            //we gonna push for follow and pull for unfollow
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Can't follow yourself");
    }
  });

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.Id !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(401).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

//delete user
router.delete("/:id", async(req, res)=>{
    //verify if the user-id doesnt match with the above id, we will return some error
    if (req.body.userId ===req.params.id || req.body.Admin){
        

        //Now DELETE THE ACTUAL USER
        try{
            const user =await User.deleteOne({_id: req.params.id});
            res.status(200).json("Your Account has been deleted")
        }
        catch(err){
            return res.status(500).json(err);
        }

    }else{
        return res.status(401).json("Only your account can be deleted unless Admin")
    }
})


//we will use this route for our users like update, getall etc
//router.get("/", (req, res)=>{
    //res.send("user API Route")
//})

module.exports = router


