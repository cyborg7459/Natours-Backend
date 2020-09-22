const mongoose = require('mongoose');
const slugify = require('slugify');

tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug : {
        type: String
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
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: {
        virtuals: true
    },
    toObject : {
        virtuals: true
    }
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7;
})

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
