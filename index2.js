const express = require("express")
const app = express()
const path = require("path")
const Chat = require('./models/chat.js')
const methodOverride = require('method-override')//for using put , patch,delete
require('dotenv').config()

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride('_method'))


const mongoose = require('mongoose');

// main().then((res) =>
//     console.log("connection successful"))

//     .catch(err => console.log(err));

// async function main() {
//     // await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
//     await mongoose.connect('mongodb+srv://nikhitadas37:Nikhita@12345@cluster0.khwuk.mongodb.net/');
// }
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
}

main().then(() => 
    console.log("Connection successful")
)
.catch(err => console.log(err));


//crud operations

app.get("/chats", async (req, res) => {
    let chats = await Chat.find()
    // console.log(chats)
    res.render("Home.ejs", { chats })
})
app.get("/chats/new", async (req, res) => {

    res.render("new.ejs")
})

app.post("/chats", (req, res) => {
    console.log(req.body);
    let { from, to, msg } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        msg: msg,
        time: new Date()
    })
    newchat.save().then((res) => console.log("sent"))
        .catch((err) => console.log(err))
    res.redirect("/chats")
})

app.get("/chats/:id/edit", async(req, res) => {
    let { id } = req.params
    let chat= await Chat.findById(id)
  res.render("edit.ejs",{chat})
})

app.put("/chats/:id", async(req,res)=>{
    let { id } = req.params
    let {msg}=req.body;
    console.log(msg)
    let updatedchat= await Chat.findByIdAndUpdate(
        id,
    {
        msg:msg,
        time: new Date()

    },
    {
        runValidators:true,new:true
    })
    console.log(updatedchat);
    res.redirect("/chats")

})

app.delete("/chats/:id",async(req,res)=>{
    let {id}= req.params
    let deletedchat=await Chat.findByIdAndDelete(id);
    console.log(deletedchat)
    // Chat.deleteOne(id)
    res.redirect("/chats")
})

app.get("/", (req, res) => {
    res.send("helllo world")
})

const PORT=process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("server is running on 8080")
})

app.post("/chats/post",(req,res)=>{
    res.send("added")
})

// let chat1=new Chat({
//     from:"Nikhita",
//     to:"Harsh",
//     msg:"Hello world",
//     time:new Date()
// })
// chat1.save().then((res)=>console.log(res))
// .catch((err)=>console.log(err))

//mongodb+srv://nikhitadas37:Nikhita@12345@cluster0.khwuk.mongodb.net/