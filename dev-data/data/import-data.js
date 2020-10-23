const dotenv = require('dotenv');
dotenv.config({path : './config.env'});
const fs = require('fs');
const Tour = require('../../models/tourModel');

// Requiring necessary modules
const mongoose = require('mongoose');
const { argv } = require('process');

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully added');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Deleted all data');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
}
else if(process.argv[2] === '--delete') {
    deleteData();
}