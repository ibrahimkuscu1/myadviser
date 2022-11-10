const express = require('express')
const app = express()
const bodyparser=require("body-parser")
const cors = require('cors');
const socketIO=require("socket.io")
const connection= require("./database/connection")
//models
const User = require("./database/models/user")
const adviser= require("./database/models/adviser")
const Messages=require("./database/models/messages")
const { model } = require('mongoose');
const port=5000

// middleware
const auth=require("./middlewares/auth")
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({extended:false})) 


// routes
const API=require("./routers/api")
const REGISTER=require("./routers/adviserRegister")
const SEARCH=require("./routers/search")


app.use("/",API)
app.use("/",REGISTER)
app.use("/",SEARCH)





app.get('/', (req, res) => {
    res.send("hello world hey!!!")
})




const server = app.listen(process.env.PORT ||port, () => {
  console.log(`Example app listening on port ${port}`)
}) 

// socket.io part

const io=socketIO(server,{
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
}) 

require("dotenv").config();
const jwt=require("jsonwebtoken")

io.use(async (socket, next) => {
  try {
  
    console.log("hello socket!!")
    const token = socket.handshake.query.token
    
    console.log(token)
    const payload = await jwt.verify(token, process.env.JWT_SECRET); 
    
    socket.userId = payload.id;
    next(); 
  } catch (err) {
     console.log(err)
    
  } 
}); 


io.on("connection", (socket) => {
  console.log( "connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });


socket.on("joinRoom", ({ chatroomId }) => {
  socket.join(chatroomId);
  console.log("A user joined chatroom: " + chatroomId);
});

socket.on("leaveRoom", ({ chatroomId }) => {
  socket.leave(chatroomId);
  console.log("A user left chatroom: " + chatroomId);
});

socket.on("chatroomMessage", async ({ chatroomId, message }) => {
  if (message.trim().length > 0) {
    const user = await User.findOne({ _id: socket.userId });
    const newMessage = new Messages({
      adviser: chatroomId,
      user: socket.userId,
      message,
    });
    io.to(chatroomId).emit("newMessage", {
      message,
      userName: user.userName, 
      userId: socket.userId,
    });
    await newMessage.save(); 
  }
});
})