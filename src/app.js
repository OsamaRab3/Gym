const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const { NotFound, globalError } = require('./middleware/errorHandler');
const locale = require('./middleware/locale');

// Middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("dev"))
app.use(cors());


app.use(locale);




// const multer = require("multer");
// const upload = multer(); 

// app.use(upload.none());
// // Routes

const authRoutes = require('./api/routes/authRoutes')
const productsRoutes = require('./api/routes/productRoutes')
const couponRoutes = require('./api/routes/couponRoutes')
const contact = require('./api/routes/contactusRoutes')
app.get('/',(req,res)=>{
    res.status(200).json({
    message: req.t('welcome'),
    status: "success"
    })

})

app.use('/api/auth',authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact',contact);


// Handle 404 Not Found
app.use(NotFound);

// Global Error Handling Middleware
app.use(globalError);


module.exports = app;
