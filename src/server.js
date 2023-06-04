const express = require('express');
//to get parrams
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const initWebRoutes = require('./route/web');
const connectDB = require('./config/connectDb');
require('dotenv').config();

let app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  const allowedOrigins = [process.env.MOBILE_APP, process.env.URL_REACT1, process.env.URL_REACT2, process.env.URL_REACT3];
  const headers = req.headers;
  const domain = headers.origin || headers.host
  if (domain && allowedOrigins.includes(domain)) {
  res.setHeader('Access-Control-Allow-Origin', domain);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
  } else {
    return res.status(505).json({ msg: 'forbidden' })
  }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => console.log("App listening at port: " + port));