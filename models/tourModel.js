const mongoose = require('mongoose');
const slugify = require('slugify');

tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less than 40 characters'],
        minlength: [10, 'A tour name must have at least 10 characters']
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
        required: [true, 'A tour must have some difficulty'],
        enum: {
            values : ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy medium or hard'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
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
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price; // This would only be performed during document creation and not in update time because the keyword 'this' associated with the document in the creation time only
            },
            message: 'Discount price should be below the actual price'
        }
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
    startDates: [Date],
    secretTour : {
        type: Boolean,
        default: false
    },
    startLocation : {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    }],
    guides : [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
}, {
    toJSON: {
        virtuals: true
    },
    toObject : {
        virtuals: true
    }
});

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7;
});

// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'forTour',
    localField: '_id'
});

// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: {$ne : true}});
    next();
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match : { secretTour: {$ne : true}}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
