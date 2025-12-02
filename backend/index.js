const express = require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
app.use(cors());
require('dotenv').config();

//importing routes
const authRoutes = require('./routes/authRoutes');
// const userRoutes=require('./routes/userRoutes');
// const postRoutes=require('./routes/postRoutes');
//middleware

app.use(express.json());

//routes middleware
app.use('/api/auth', authRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/posts',postRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/posts',postRoutes);

//connecting to database
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log("Error connecting to database:",err);
});

//starting a server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});