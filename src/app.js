const express = require('express');
const helmet  = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const { NotFound , globalError } = require('./middleware/errorHandler')

// Middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("dev"))
app.use(cors());




// const multer = require("multer");
// const upload = multer(); 

// app.use(upload.none());
// // Routes

const authRoutes = require('./api/routes/authRoutes')
const productsRoutes = require('./api/routes/productRoutes')
app.get('/',(req,res)=>{
    res.status(200).json({
    message: "Welcome to e-commerce API",
    status: "success"
    })

})

app.use('/api/auth',authRoutes)
app.use('/api/products', productsRoutes)








// Handle 404 Not Found
app.use(NotFound);

// Global Error Handling Middleware
app.use(globalError);





module.exports = app;


