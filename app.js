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

var http = require('http');
const PORT = 8000;

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.use(session({
  secret: 'aeriu23487gfuyjhblkkjaw53u1134eeu',
  resave: false,
  saveUninitialized: true,
    //change this later
  cookie: { secure: false }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/productline', productlineRouter);
app.use('/sku', skuRouter);
app.use('/manufacturing_goals', mgRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
k

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

module.exports = app;
