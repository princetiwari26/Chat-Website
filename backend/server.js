const experss = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const http = require('http')
const { Server } = require('socket.io')
const DBConnection = require('./config/dbConnection')
const userRouter = require('./routers/user.router')
const chatRouter = require('./routers/chat.router')
dotenv.config()
DBConnection()

const app = experss()
const PORT = process.env.PORT

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})


app.use(experss.json())
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions))


app.get("/api/auth/verify", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId
    // console.log(req.id)
    return res.status(200).json({ userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


app.use('/api/auth/user', userRouter)
app.use('/api/chats', chatRouter)

io.on("connection", (socket) => {
  // console.log('New Connection', socket.id)
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`)
})