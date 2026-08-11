/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/rhtc/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));

  server.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  //Set up mongoose connection
  const mongoose = require('mongoose');
  const mongoDB = process.env.MONGO_URI || 'mongodb://localhost:27018/local';
  // maxPoolSize must be set explicitly: the driver defaults to 100, while
  // infra.json declares max_pool_size 20 — and mongod caps the whole cluster at
  // net.maxIncomingConnections=1200, shared by every app.
  mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, maxPoolSize: 20, minPoolSize: 1 });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  // Get our API routes
  // Get our API routes
  const user = require('./server/routes/user/user');
  const fileHandler = require('./server/routes/fileHandler/fileHandler');
  const pay = require('./server/routes/payment/payment');
  const student = require('./server/routes/student/student');
  const news = require('./server/routes/news/news');
  const gallery = require('./server/routes/gallery/gallery');

  // Set our api routes
  server.use('/api/users', user);
  server.use('/api/files', fileHandler);
  server.use('/api/pay', pay);
  server.use('/api/student', student);
  server.use('/api/news', news);
  server.use('/api/gallery', gallery);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
