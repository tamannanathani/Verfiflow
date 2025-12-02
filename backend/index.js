const express = require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

//importing routes
const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const postRoutes=require('./routes/postRoutes');

//middlewares
app.use(cors());
app.use(express.json());

//routes middleware
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

//connecting to database
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log("Error connecting to database:",err);
});