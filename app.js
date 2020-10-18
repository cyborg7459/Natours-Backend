// Requiring modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Requiring functions and middleware
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const globalErrorHandler = require('./controllers/error-controller');
const appError = require('./utils/appError');

// MIDDLEWARE
app.use(helmet());   // Security HTTP Headers
if(process.env.NODE_ENV === 'development')      // Logging during development
    app.use(morgan('dev'));
else 
    console.log('Running app in production mode');

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);       // Rate limiting
app.use(express.json({
    limit: '10kb'
}));        // Body parser
app.use(express.static('public'));      // Serving static files

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req,res,next) => {
    const err = new appError(`Can't find ${req.originalUrl} on the server !!!`, 404);
    next(err);
})
app.use(globalErrorHandler);

module.exports = app;
