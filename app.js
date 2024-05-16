var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var bodyparser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var departmentRouter = require('./routes/department');
var positionRouter = require('./routes/positions');
var employeeRouter = require('./routes/employees');
var contractRouter = require('./routes/contract');
var marvelRouter = require('./routes/marvel');
var marvelDetailRouter = require('./routes/marvelDetail');
var attendancesRouter = require('./routes/attendances');
var salaryRouter = require('./routes/salary');
var workRouter = require('./routes/work');
var benefitRouter = require('./routes/benefit');

var app = express();
app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/department', departmentRouter);
app.use('/position', positionRouter);
app.use('/employees', employeeRouter);
app.use('/contract', contractRouter);
app.use('/marvel', marvelRouter);
app.use('/marvelDetails', marvelDetailRouter);
app.use('/attendances', attendancesRouter);
app.use('/salary', salaryRouter);
app.use('/work', workRouter);
app.use('/benefit', benefitRouter);

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

module.exports = app;
