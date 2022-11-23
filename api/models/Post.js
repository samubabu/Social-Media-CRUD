const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
    userId:{
    type:String,
    required: true},
    username:{
    type:String,
    required: true},
    title: {
    type: String,
    max:50},
    message: {
    type:String,
    max:500},
    tags: [String],
    selectedFile: String,
    likes: {
        type: Array,
        default: [],
    },
},
    {timestamp:true},
    {createdAt: {
        type: Date,
        default: new Date(),
    }},
)
//check here for debugging

module.exports = mongoose.model("Post", PostSchema);