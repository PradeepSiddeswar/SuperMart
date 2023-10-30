const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const http = require('http');

const app = express()
const server = http.createServer(app);

const socketIo = require('socket.io');

const io = socketIo(server);

// Your other app setup code

// Socket.io connections
io.on('connection', (socket) => {
  console.log('A client connected.');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});





app.use(cors({
  origin: 'http://localhost:3000',
  methods:['GET', 'POT', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']

}))

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
  credentials: true
}));

const bp = require("body-parser")
app.use(bp.json());
app.use(bp.urlencoded({extended:false}));

// const HomePageRoute = require("./Routes/HomePage_Router")
const RegisterRoute = require("./Routes/Register_Router")
const OrdersRoute = require("./Routes/Orders_Router")


dotenv.config({ path: '.env'})
const PORT = process.env.PORT || 8080
console.log("Server Started", PORT)
const mongoose = require("mongoose");
mongoose.pluralize(null)
mongoose.connect(process.env.MONGO_URL, {

})
.then(() => console.log(`Connected To Database`))
.then(() => {
    app.listen(PORT);
})
.catch((error) => console.log(error));


app.get("/", (req, res) => {
    res.send("Hello world")
})


app.use(express.static("upload"))
// app.use('/Profile-PostedPic', HomePageRoute)
app.use('/Register', RegisterRoute)
app.use('/Orders', OrdersRoute )