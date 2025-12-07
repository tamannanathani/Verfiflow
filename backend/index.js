const express = require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
app.use(cors({
  origin: "*",
  methods: "GET,POST,PATCH,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));
require('dotenv').config();
const path = require('path');
const fs = require('fs');

//importing routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
// const userRoutes=require('./routes/userRoutes');
// const postRoutes=require('./routes/postRoutes');
//middleware

app.use(express.json());

//routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/posts',postRoutes);
// app.use('/api/users',userRoutes);
// app.use('/api/posts',postRoutes);

// ensure uploads directory exists and serve it statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
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

// (uploads are served above)