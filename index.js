const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');

// MIDDLEWARE

app.use(morgan('dev'));
app.use(express.json());
app.use((req,res,next) => {
    console.log('Hello from the middleware !!!');
    next();
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;