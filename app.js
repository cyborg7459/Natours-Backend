// Requiring modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

// Requiring functions and middleware
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const reviewRouter = require('./routes/review-routes');
const viewRouter = require('./routes/view-routes');
const globalErrorHandler = require('./controllers/error-controller');
const appError = require('./utils/appError');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));      

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
       next();
 });

// MIDDLEWARE
// // Security HTTP Headers
// app.use(helmet());  
// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         "default-src": ["'self'"],
//         "connect-src": ["'self'", "'unsafe-inline'"],
//         "img-src": ["'self'", "data:"],
//         "style-src-elem": ["'self'", "data:"],
//         "script-src": ["'unsafe-inline'", "'self'"],
//         "object-src": ["'none'"],
//       },
//     })
// ); 

// Logging during development
if(process.env.NODE_ENV === 'development')      
    app.use(morgan('dev'));
else 
    console.log('Running app in production mode');

// Rate limiting
// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60*60*1000,
//     message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);  

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());        

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
// app.use(xss());

// Preventing parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'rating', 'maxGroupSize',
        'price', 'difficulty'
    ]
}));

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
})

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req,res,next) => {
    const err = new appError(`Can't find ${req.originalUrl} on the server !!!`, 404);
    next(err);
})
app.use(globalErrorHandler);

module.exports = app;
