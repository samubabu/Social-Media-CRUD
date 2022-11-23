const express = require("express");

//now we can create our application express
const app = express();

const mongoose=require("mongoose");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const dotenv=require("dotenv");
const helmet=require("helmet")
const morgan=require("morgan")



//to use dotenv  we do
dotenv.config();

mongoose.connect(process.env.MONGO_URL);
console.log("MONGODATABASE CONNECTED")

//middleware starts
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))


//address for the users
app.use("/api/users", userRoute);
//address for the auth
app.use("/api/auth", authRoute);
//address for the posts
app.use("/api/posts", postRoute);


//lets start our application
app.get("/",(req, res)=>{
    res.send("Home PAGE Goochi")
})

app.get("/users",(req, res)=>{
    res.send("User PAGE Goochi")
})


app.listen(5000, ()=>{
    console.log("Backend Ready")
})