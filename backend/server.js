import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'


//App config
const app = express()
const port = process.env.PORT || 3000

connectDB()
connectCloudinary()
//middleware
app.use(express.json())
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
].filter(Boolean);
app.use(cors(allowedOrigins.length > 0 ? { origin: allowedOrigins, credentials: true } : {}))

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.get('/',(req,res)=> {
    res.send("API WORKING")
})


app.listen(port,()=> console.log("Server started on PORT :" + port))