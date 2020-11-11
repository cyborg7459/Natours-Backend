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

// This part is to ensure review statistics on a tour are updated while updating and deleting a review as well. First of all, since this is a query middleware thus we cannot directly access the document because 'this' refers to the query. So we can await the query to get the document. However, there is one more problem - In 'pre' middleware the review is not yet updated thus the function will have no effect, while in post middleware the query will have executed and we can no longer await the query. Thus we use the trick that first we use pre middleware and await the document, and attach it to the query itself (this.r), now we can access this in the post middleware and apply .constructor to refer to the model, and then run the calcAverageRatings static function on the model

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, function() {
    this.r.constructor.calcAverageRatings(this.r.forTour);
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;