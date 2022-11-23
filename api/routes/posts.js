const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//router.get("/",(req,res)=>{
    //console.log("POST GOES")
//})

//create a post 
router.post("/",  async (req, res) => {
    //const { userId, title, message, selectedFile, tags } = req.body; WRONG
    const newPost = new Post(req.body);
    //const newPost = new Post({ userId, title, message, selectedFile, tags }) WRONG

    try {
        const savedPost = await newPost.save();

        res.status(201).json(savedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
})



//delete a post
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("Your post has been deleted");
      } else {
        res.status(403).json("You can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//like a post
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get user's all post 
router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });








// get followers post 
router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      //console.log(userPosts);
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      console.log(friendPosts)
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get single post of user
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//update a post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      //check the owner of the post and if its same, go ahead and update
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("Your post has been updated");
      } else {
        res.status(403).json("You can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;