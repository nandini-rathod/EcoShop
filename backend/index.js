const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")

app.get("/",(req,res)=>{
    res.send("hello world")
})

// middlewares
app.use(express.json());
app.use(cors());

//routes
const connection = require("./DB")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/products")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const educativeContentRoute = require("./routes/educativeContentRoute") 
const sustainabilityRoute = require("./routes/sustainability")

// DB connection 
connection()

//routes
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/checkout",stripeRoute)
app.use("/api/educativecontent",educativeContentRoute)
app.use("/api/sustainability", sustainabilityRoute)

const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`you are listening on PORT ${PORT}`)
})