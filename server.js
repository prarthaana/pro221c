const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);
var nodemailer=require("nodemailer")
const transporter = nodemailer.createTransport({
    port :465,
    host:"smtp.gmail.com",
    auth:{
        user:"",pass:""
        
    },
    secure:true,
});

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});
app.post("/send-mail",(req,res)=>{
    const to = req.body.to;
    const url=req.body.url 
    const mailData={
        from :"16prarthaananair9.j@gmail.com",
        to:"16prarthaanair9.j@gmail.com",
        subject:"join the video chat with me ",
        html:`<p>pls join me for a video chat -${url}</p>`
    }
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        io.to(roomId).emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

server.listen(process.env.PORT || 3030);