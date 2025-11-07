import express from 'express'
import { adminAuthRouter } from './Routes/adminAuth.route.js';
import mongoose from 'mongoose';
import { seedAdmin } from './Controllers/adminAuth.controller.js';
import cookieParser from "cookie-parser";
import { configDotenv } from 'dotenv';
import cors from 'cors' 
import { adminProductsRouter } from './Routes/adminProducts.route.js';
configDotenv()
const app = express()
const port = 3000


app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL.replace(/\/$/, ""), // removes trailing slash if any
  credentials: true,
}));



app.use(cookieParser());


try {
  await mongoose.connect(process.env.MONGO_URI);
} catch (error) {
    console.log(error)
}


  await seedAdmin();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// admin routes
app.use('/api/admin',adminAuthRouter)
app.use('/api/admin/products',adminProductsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
