// ************ Require's ************
const express = require('express');
const cookies = require('cookie-parser');
const session = require("express-session")
const path = require('path');
const logger = require('morgan');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE
const app = express();



const userLoggedMiddleware = require("./middlewares/userLoggedMiddleware")
const mainRouter = require('./routes/main'); // Rutas main
//const recordameMiddleware = require("./middlewares/recordameMiddleware")


// ************ Middlewares - (don't touch) ************
app.use(express.static(path.join(__dirname, '../public')));  // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));//sirve para capturar el req.body de un form
app.use(logger('dev'));
app.use(express.json());
app.use(cookies());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(session({secret: "secreto!!",
resave: false,
saveUninitialized: false,}))
app.use(userLoggedMiddleware)

//app.use(recordameMiddleware())

// ************ Template Engine - (don't touch) ************
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); // Define la ubicación de la carpeta de las Vistas


app.use('/', mainRouter);




module.exports = app;
