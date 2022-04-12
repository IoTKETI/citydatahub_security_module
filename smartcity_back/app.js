/*
MIT License

Copyright (c) 2017 gwiazdorrr

     

Permission is hereby granted, free of charge, to any person obtaining a copy

of this software and associated documentation files (the "Software"), to deal

in the Software without restriction, including without limitation the rights

to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

copies of the Software, and to permit persons to whom the Software is

furnished to do so, subject to the following conditions:

     

The above copyright notice and this permission notice shall be included in all

copies or substantial portions of the Software.

     

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR

IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE

AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE

SOFTWARE.
*/


const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const pg = require('pg')
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const rfs = require('rotating-file-stream');
const cors = require('cors');
const helmet = require('helmet');
const serverInfo = require('./server_conf');

const indexRouter = require('./routes/index');
const oauth2Router = require('./routes/oauth2Endpoints');
const endpointRouter = require('./routes/apis');
const userRouter = require('./routes/users');
const accountRouter = require('./routes/accounts');
const appRouter = require('./routes/apps');

const app = express();

require('./util/checker');

const pgPool = new pg.Pool({
  // Insert pool options here
  user : serverInfo.dbUserId,
  host : serverInfo.dbHost,
  database : serverInfo.dbName,
  password : serverInfo.dbUserPwd,
  port :serverInfo.dbPort,
});

app.use(session({
  store: new pgSession({
    pool : pgPool,          // Connection pool
    tableName : 'session'   // Use another table-name than the default "session" one
  }),
  secret: 'cityhubaas%^#!!',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 10 * 30 * 1000 * 3} // 15 minutes
  //h, m , s, ms
}));

// init passport module
app.use(passport.initialize());
app.use(passport.session());
require('./routes/passport');

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({extended: false}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(helmet());

const logDir = path.join(__dirname, 'log');
fs.existsSync(logDir) || fs.mkdirSync(logDir);
const Log = rfs('server.log',{
  interval : '1d',
  path : logDir
});
app.use(morgan('combined',{stream: Log}));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/apps', appRouter);
app.use('/accounts', accountRouter);
app.use('/oauth2.0', oauth2Router);
app.use('/security', endpointRouter);


app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  //res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(err.status == 400){
    res.status(400);
    return res.render('error/wrongAccess');
  }
  if(err.status == 403){
    res.status(403);
    return res.render('error/wrongAccess');
  }
  else if(err.status == 404){
    res.status(404);
    return res.render('error/notFound');
  }
  else{ //500
    res.status(500);
    return res.render('error/internalError');
  }
});

module.exports = app;
