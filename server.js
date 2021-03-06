// Setting up the .env file
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

// Handling uncaught exceptions
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
})

// Requiring necessary modules
const app = require('./app');
const mongoose = require('mongoose');

// Database connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to database')
})

// Server start
const port = process.env.PORT||3000;
const server = app.listen(port, () => {
    console.log('Server running on port 3000');
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})

