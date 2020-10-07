// Requiring modules
const express = require('express');
const app = express();
const morgan = require('morgan');

// Requiring functions and middleware
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const globalErrorHandler = require('./controllers/error-controller');
const appError = require('./utils/appError');

// MIDDLEWARE
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
else 
    console.log('Running app in production mode');

app.use(express.json());

// Routes
app.use(express.static('public'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req,res,next) => {
    const err = new appError(`Can't find ${req.originalUrl} on the server !!!`, 404);
    next(err);
})
app.use(globalErrorHandler);

module.exports = app;
