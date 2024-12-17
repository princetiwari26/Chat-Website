const experss = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const DBConnection = require('./config/dbConnection')
const userRouter = require('./routers/user.router')
dotenv.config()
DBConnection()

const app = experss()
const PORT = process.env.PORT

const server = http.createServer(app)

app.use(experss.json())
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions))

app.use('/api/auth/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`)
})