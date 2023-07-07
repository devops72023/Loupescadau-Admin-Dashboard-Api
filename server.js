import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose';
import path, { dirname } from 'path'; 
import { config } from 'dotenv';
config();

const app = express();

// DB connection
mongoose
  .connect(process.env.MONGO_DB_URI).then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(process.env.MONGO_DB_URI);
    console.log(`Error connecting to the database:\n ${err}`);
  });

// Import different routes
import AuthRouter from './Routes/Auth.js';
import userRoute from './Routes/Users.js';
import productsRouter from './Routes/Products.js';
import categoryRouter from './Routes/category.js';
import settingRouter from './Routes/Setting.js';
import couponRouter from './Routes/Coupon.js';
import { fileURLToPath } from 'url';

// The cors middleware configuration.
const corsOptions = {
    origin: ['http://localhost:5173', 'http://192.168.1.77:5173/'], // Allow requests from a specific origin
    methods: '*', // Allow only specified HTTP methods
    allowedHeaders: '*', // Allow only specified headers
  };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(path.join(__dirname, 'Assets'))

app.use(express.json());
app.use(Cors(corsOptions));
app.use(express.static(path.join(__dirname, 'Assets')));

app.get('/',  function(req, res){
    res.json({success: "OK", message:"Loupescadau Api is available under http://localhost:3000/api/"});
}); 

app.use('/api/auth', AuthRouter);
app.use('/api/users', userRoute);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/settings', settingRouter);
app.use('/api/coupons', couponRouter);

app.listen(3000, () => console.log('Server listening on port 3000'));