const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty'],
        trim: true
    },
    rating: {
        type: Number,
        max: [5, 'Rating can\'t be more than 5 stars'],
        min: [0, 'Rating can\'t be less than zero']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    },
    forTour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    byUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must have a user']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.pre(/^find/, async function(next) {
    this.populate({
        path: 'byUser',
        select: '-__v -passwordChangedAt'
    });
    next();
})

reviewSchema.pre('save', function(next) {
    if(!this.isNew)
        this.updatedAt = Date.now();
    next();
})

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {forTour: tourId}
        },
        {
            $group: {
                _id: '$forTour',
                nRating: { $sum: 1 },
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    const newTourStats = {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    }
    await Tour.findByIdAndUpdate(tourId, newTourStats);
}

reviewSchema.post('save', function() {
    // This points to the current review, and this.constructor points to the model
    this.constructor.calcAverageRatings(this.forTour);
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, function() {
    this.r.constructor.calcAverageRatings(this.r.forTour);
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;