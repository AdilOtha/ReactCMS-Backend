const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect("mongodb+srv://adilotha:XewPadtj2llrVEsY@node-rest-shop.yxg2l.mongodb.net/demo?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.use(cors("*"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const articleRoutes = require('./api/routes/articles');
const userRoutes = require('./api/routes/users');
const categoryRoutes = require('./api/routes/categories');
const menuRoutes = require('./api/routes/menus');

app.use('/api/articles',articleRoutes);
app.use('/api/users',userRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/menus',menuRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            msg: error.message
        }
    })
})

module.exports=app;