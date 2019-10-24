// set up ===============================================================
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
var cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
var cronJob = require('./cronJob')
require('dotenv').config();
require('./middleware/passport')(passport);

// DB configuration ===============================================================
const dbRoute = process.env.DB_URI;
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());


// router files ===============================================================
var testRoutes   = require('./routes/test');
var catererRoutes   = require('./routes/caterer');
var customerRoutes   = require('./routes/customer');
var menuRoutes   = require('./routes/menu');
var lunchMenuRoutes   = require('./routes/lunchMenu');
var orderRoutes   = require('./routes/order');
var reviewRoutes   = require('./routes/review');
var authRoutes   = require('./routes/auth');
var paymentRoutes   = require('./routes/payment');
var catererPublishedRoutes   = require('./routes/catererPublished');
var menuPublishedRoutes   = require('./routes/menuPublished');
var lunchMenuPublishedRoutes   = require('./routes/lunchMenuPublished');
var lunchOrderRoutes   = require('./routes/lunchOrder');

// routes ======================================================================
app.use('/test', testRoutes);
app.use('/caterer', catererRoutes);
app.use('/customer', customerRoutes);
app.use('/menu', menuRoutes);
app.use('/lunchMenu', lunchMenuRoutes);
app.use('/order', orderRoutes);
app.use('/review', reviewRoutes);
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/catererPublished', catererPublishedRoutes);
app.use('/menuPublished', menuPublishedRoutes);
app.use('/lunchMenuPublished', lunchMenuPublishedRoutes);
app.use('/lunchOrder', lunchOrderRoutes);

//cronJob.executeCronJob()

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

console.log(process.env.NODE_ENV)

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'client/public/index.html'));
})

//start server
app.listen(port, (req, res) => {
  console.log( `server listening on port: ${port}`);
})