var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var cors = require('cors')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var incidentsRouter = require('./routes/incidents');
var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/incidents', incidentsRouter);

module.exports = app;
