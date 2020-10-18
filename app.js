// Requiring modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Requiring functions and middleware
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const globalErrorHandler = require('./controllers/error-controller');
const appError = require('./utils/appError');

// MIDDLEWARE
// Security HTTP Headers
app.use(helmet());   

// Logging during development
if(process.env.NODE_ENV === 'development')      
    app.use(morgan('dev'));
else 
    console.log('Running app in production mode');

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);  

// Body parser
app.use(express.json({          
    limit: '10kb'
}));        

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Preventing parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'rating', 'maxGroupSize',
        'price', 'difficulty'
    ]
}));

// Serving static files
app.use(express.static('public'));      

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req,res,next) => {
    const err = new appError(`Can't find ${req.originalUrl} on the server !!!`, 404);
    next(err);
})
app.use(globalErrorHandler);

module.exports = app;
