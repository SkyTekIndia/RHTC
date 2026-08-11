// Get dependencies
var express = require('express'), 
compression = require('compression'),
http = require('http'),
path = require('path'),
bodyParser = require('body-parser');

const app = express();

app.use(compression());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost:27017/local';
// maxPoolSize must be set explicitly: the driver defaults to 100, while
// infra.json declares max_pool_size 20 — and mongod caps the whole cluster at
// net.maxIncomingConnections=1200, shared by every app.
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, maxPoolSize: 20, minPoolSize: 1 });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Get our API routes
const user = require('./server/routes/user/user');
const fileHandler = require('./server/routes/fileHandler/fileHandler');
const pay = require('./server/routes/payment/payment');
const student = require('./server/routes/student/student');
const news = require('./server/routes/news/news');
const gallery = require('./server/routes/gallery/gallery');

// Set our api routes
app.use('/api/users', user);
app.use('/api/files', fileHandler);
app.use('/api/pay', pay);
app.use('/api/student', student);
app.use('/api/news', news);
app.use('/api/gallery', gallery);

// Catch all other routes and return the index file
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/rhtc/browser/index.html'));
});


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));