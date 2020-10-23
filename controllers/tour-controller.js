const appError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// ROUTE HANDLERS

exports.aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req,res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        const allTours = await features.query;

        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                tours: allTours
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
        })
    }
}

exports.addTour = async (req,res,next) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.getSingleTour = async (req,res,next) => {
    try {
        const tour = await Tour.findById(req.params.id).populate('guides');
        if(!tour) {
            return next(new appError('No tour found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.updateTour =  async (req,res, next) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true  // this makes sure that if any validations are present in the model, then they are run at the time of updating tours as well, and not just at the time of creating them
        });
        if(!tour) {
            return next(new appError('No tour found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.deleteTour = async (req,res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if(!tour) {
            return next(new appError('No tour found with that ID', 404));
        }
        res.status(200).json({
            status: 'Success',
            message: 'Successfully deleted tour'
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'Failure',
            message: err
        })
    }
}

exports.getTourStats = async (req,res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { difficulty : { $in : ["easy", "difficult"] } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings : { $sum: '$ratingsQuantity'},
                    avgRating : { $avg: '$ratingsAverage' },
                    avgPrice : { $avg : '$price' },
                    minPrice : { $min : '$price' },
                    maxPrice : { $max : '$price' }
                }
            },
            {
                $sort: {
                    avgPrice: -1
                }
            }
        ]);
        res.status(200).json({
            status : 'success',
            data : stats
        })
    }
    catch(err) {
        res.status(400).json({
            status: 'Failure',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req,res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match : {
                    startDates: { 
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`) 
                    }
                }
            },
            {
                $group : {
                    _id: {$month: '$startDates'},
                    numTours: { $sum : 1 },
                    tours: { $push : '$name' }
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort : {
                    numTours: -1
                }
            },
            {
                $limit : 4
            }
        ]);
        res.status(200).json({
            status : 'success',
            data : plan
        })
    }
    catch(err) {
        res.status(400).json({
            status: 'Failure',
            message: err
        })
    }
} 