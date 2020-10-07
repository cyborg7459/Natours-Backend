const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');

// MIDDLEWARE

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
else 
    console.log('Running app in production mode');

app.use(express.json());

app.use(express.static('public'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req,res,next) => {
    res.status(404).json({
        status: 'Failure',
        message: `Can't find ${req.originalUrl} on this server !!!`
    })
    next();
})

module.exports = app;
