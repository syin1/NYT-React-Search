const express = require('express'); // Server
const bodyParser = require('body-parser'); // JSON Middleware
const logger = require('morgan'); // REST Logger
const mongoose = require('mongoose'); // MongoDB ORM
const routes = require('./routes');
let db = require('./models'); // Require all models

let PORT = process.env.PORT || 8080;
let mongooseConnection = mongoose.connection;

let app = express();

/* Express Middleware */

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Allows For JSON Interactions Between Client & Server
app.use(express.static('client/build')); // Serve Static React Pages
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/* Mongoose Configurations */
mongoose.Promise = global.Promise; // Set up promises with mongoose

mongoose.connect(
  // Connect to the Mongo DB
  process.env.MONGODB_URI ||
    'mongodb://heroku_svtzgtmn:b0i14s41prfbttfccj29m8o1sj@ds151951.mlab.com:51951/heroku_svtzgtmn'
);

mongooseConnection.on(
  'error',
  console.error.bind(console, 'connection error:')
);

mongooseConnection.once('open', function() {
  console.log(`Sucessfully Connected to Mongo DB !`); // If Connection is successful, Console.log(Message)
});

var cors = require('cors');
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(cors());

app.use(routes); // Add routes, both API and View

/* Start Server */

app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
