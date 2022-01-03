require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect(`mongodb+srv://adilotha:${process.env.MONGO_DB}@node-rest-shop.yxg2l.mongodb.net/demo?retryWrites=true&w=majority`,
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

const articleRoutes = require('./api/routes/admin/articles');
const userRoutes = require('./api/routes/admin/users');
const categoryRoutes = require('./api/routes/admin/categories');
const menuRoutes = require('./api/routes/admin/menus');
const menuItemRoutes = require('./api/routes/admin/menuItems');
const mainMenuRoutes = require('./api/routes/admin/mainMenu');
const sideMenuRoutes = require('./api/routes/admin/sideMenu');
const authRoutes = require('./api/routes/admin/auth');

const articleRoutesSite = require('./api/routes/site-readonly/articles');
const categoryRoutesSite = require('./api/routes/site-readonly/categories');
const menuRoutesSite = require('./api/routes/site-readonly/menus');
const menuItemRoutesSite = require('./api/routes/site-readonly/menuItems');
const mainMenuRoutesSite = require('./api/routes/site-readonly/mainMenu');
const commentsRoutesSite = require('./api/routes/site-readonly/comments');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/main-menu', mainMenuRoutes);
app.use('/api/side-menu',sideMenuRoutes);

app.use('/api/site/articles', articleRoutesSite);
app.use('/api/site/categories', categoryRoutesSite);
app.use('/api/site/menus', menuRoutesSite);
app.use('/api/site/menu-items', menuItemRoutesSite);
app.use('/api/site/main-menu', mainMenuRoutesSite);
app.use('/api/site/comments',commentsRoutesSite);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            msg: error.message
        }
    })
})

module.exports = app;