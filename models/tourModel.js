const mongoose = require('mongoose');

tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    duration : {
        type: Number,
        required: [true, 'A tour must have some duration']
    },
    maxGroupSize : {
        type: Number,
        required: [true, 'A tour must have a maximum group size']
    },
    difficulty : {
        type: String,
        required: [true, 'A tour must have some difficulty']
    },
    ratingsAverage: {
        type: Number
    },
    ratingsQuantity : {
        type: Number
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required:  [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description : {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
})

const Tour = mongoose.model('Tour', tourSchema);


module.exports = Tour;