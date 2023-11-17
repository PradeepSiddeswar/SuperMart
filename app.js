const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const http = require('http');
const Orders = require("./Model/Orders_Model")
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

const RegisterRoute = require("./Routes/Register_Router")
const OrdersRoute = require("./Routes/Orders_Router")
const HomePageRoute = require("./Routes/HomePage_Router")
const SingleBannerRoute = require("./Routes/SingleBanner_Router")
const AddCardRoute = require("./Routes/AddCard_Router")
const ProductListRoute = require("./Routes/ProductList_Router")
const OrderDetalsRoute = require('./Routes/OrderDetails_Router')
const CategoryRoute = require('./Routes/Category_Router')
const KitchenEssentialsRoute = require("./Routes/KitchenEssentials_Router")
const BeautyProductsRoute = require('./Routes/BeautyProduct_Router')
const CookingVesselsRoute = require('./Routes/CookingVessels_Router')
const PersonalCareRoute = require('./Routes/PersonalCare_Router')
const FruitRoute = require('./Routes/FruitVeggies_Router')




dotenv.config({ path: '.env'})
const PORT = process.env.PORT || 5000
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

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // The distance in kilometers
  return distance;
}

//order_id
app.get('/Orders', async (req, res) => {
  try {
    const orderId = req.query.orderID; 

    let order = await Orders.findOne({ orderID: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentLocation = { latitude: 12.9352, longitude: 77.6245 }; 

    // Check if the location data is valid
    if (
      order.DropLocation &&
      order.DropLocation.latitude &&
      order.DropLocation.longitude &&
      currentLocation &&
      currentLocation.latitude &&
      currentLocation.longitude
    ) {
      // Calculate the distance
      const distance = calculateDistance(
        order.DropLocation.latitude,
        order.DropLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude
      );

      // Format the distance and add it to the order
      const formattedDistance = distance === 0 ? '0 km' : `${distance.toFixed(2)} km`;
      order = order.toObject(); t
      order.distance = formattedDistance;
    } else {
      order.distance = 'Invalid location data';
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Error fetching order details', message: error.message });
  }
});



app.use(express.static('public'));

// app.use(express.static("upload"))
app.use('/Register', RegisterRoute)
app.use('/Orders', OrdersRoute )
app.use('/MainBanar', HomePageRoute)
app.use('/SingleBanner', SingleBannerRoute)
app.use('/Add-to-cart', AddCardRoute)
app.use('/Categories-list',ProductListRoute)
app.use('/order-details', OrderDetalsRoute)
app.use('/api', CategoryRoute) // Category is the Main  And imported all models in category controller.js 
app.use('/KitchenEssentials',KitchenEssentialsRoute)
app.use('/BeautyProducts', BeautyProductsRoute)
app.use('/CookingVessels', CookingVesselsRoute)
app.use('/PersonalCare', PersonalCareRoute)
app.use('/FruitAndVeggies',FruitRoute)