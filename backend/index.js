const express = require('express');
const app = express();
const connectDatabase = require("./dbconnect/dbconnect.js");
const dotenv = require("dotenv");
dotenv.config({ path : "./config/config.env" });
const authRoute = require("./routes/authRoute.js");
const postRoute = require("./routes/postRoute.js");
const userRoute = require("./routes/userRoute.js");
const chatRoute = require("./routes/chatRoute.js");
const messageRoute = require("./routes/messageRoute.js");
const cors = require("cors");
const upload = require("./multer");
const cloudinary = require("./cloudinary"); 
const bodyParser = require("body-parser"); 
const fs = require("fs"); 

const port = process.env.PORT;
app.use(express.json());
connectDatabase();
app.use(cors());

app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);
app.use("/api/user",userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);


app.get("/", async (req,res ) => {
    res.send("HELLO WORLD !!! ");
})

////////////////////////////////////////////////////

app.use('/upload-images',upload.array('image'),async(req,res)=>{
    const uploader=async(path)=>await cloudinary.uploads(path,'Image')
    if(req.method==='POST')
    {
        const urls=[]
        const files=req.files

        for(const file of files){
            const {path}=file 
            const newPath=await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        res.status(200).json({
            message:'Image Uploaded Successfully',
            data:urls
        })
         
    }
    else{
        res.status(405).json({
            err:"Image not uploaded"
        })
    }
})


////////////////////////////////////////////////////


const server = app.listen(
  port,
  console.log(`Server running on PORT ${port}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("User Has Joined the room " + userData._id);
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      console.log(" This message was recieved from Client Side -----> \n Sender is : " ,newMessageReceived.sender.firstName );
      if (!chat.users) return console.log("chat.users not defined");
      
      chat.users.forEach((user) => {
        if (user._id == newMessageReceived.sender._id) return;
        console.log(" Emitting this message to this client ----> " , user );
        socket.in(user).emit("message received", newMessageReceived);
      });
    });
  
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });



///////////////////////////////////////////////////



// app.listen(port, ()=>{
//     console.log(`listening to port : ${port} `);
// })


