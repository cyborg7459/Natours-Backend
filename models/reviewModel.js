const mongoose = require('mongoose');

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

reviewSchema.pre('save', function(next) {
    if(this.isModified('review') || this.isModified('rating'))
        this.updatedAt = Date.now();
    next();
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;