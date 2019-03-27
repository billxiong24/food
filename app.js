require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ingredientsRouter = require('./routes/ingredients');
var productlineRouter = require('./routes/productline');
var skuRouter = require('./routes/sku');
var mgRouter = require('./routes/manufacturing_goals');
var bulkRouter = require('./routes/bulk');
var schedulerRouter = require('./routes/scheduler');
var formulaRouter = require('./routes/formula');
var mlRouter = require('./routes/manufacturing_lines');
var salesRouter = require('./routes/sales');
var customerRouter = require('./routes/customer');


var { checkUserAll, checkCookie, checkAdminAll } = require('./routes/guard');

var http = require('http');
var https = require('https');
const fs = require('fs');
const PORT = 8000;
const encrypt = process.env.HTTPS;
const domain = process.env.DOMAIN;

var app = express();
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    if (origin == "https://" + domain || origin == 'http://localhost:3000' || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//if(process.env.NODE_ENV !== 'test')
    app.use(logger('dev'));

app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new (require('connect-pg-simple')(session))(),
    //change this later
  resave: false,
  saveUninitialized: false,
  cookie: { secure: encrypt, maxAge: 24*60*60*1000 }

}));

// Check for sessions
if(process.env.NODE_ENV !== 'test') {
    app.use(checkCookie);
    app.use(checkUserAll);
    app.post('*', checkAdminAll);
    app.put('*', checkUserAll);
    app.delete('*', checkAdminAll);
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/productline', productlineRouter);
app.use('/sku', skuRouter);
app.use('/manufacturing_goals', mgRouter);
app.use('/bulk', bulkRouter);
app.use('/sales',salesRouter);
app.use('/scheduler',schedulerRouter)
app.use('/formula', formulaRouter);
app.use('/manufacturing_line', mlRouter);
app.use('/customer', customerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if(encrypt == 'true') {
    // Certificate Setup
    // Certificate
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      console.log("HTTPS Server started on port " + PORT);
    });
}
else {
    app.listen(PORT, () => {
        console.log("Server started on port " + PORT);
    });
}



module.exports = app;
