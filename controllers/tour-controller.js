const appError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');

exports.getAllTours = factory.getAll(Tour);
exports.getSingleTour = factory.getOne(Tour, {path: 'reviews'});
exports.addTour = factory.createOne(Tour);
exports.updateTour =  factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getTourStats = async (req,res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { difficulty : { $in : ["easy", "difficult", "medium"] } }
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

exports.getToursWithin = async (req,res,next) => {
    try {
        const {distance, coordinates , unit} = req.params;
        const [lat, long] = coordinates.split(',');
        const radius = unit==='mi' ? distance/3963.2 : distance/6378.1;
        if(!lat || !long) {
            return new appError('Please provide latitude and longitude in correct format - lat, long', 400);
        }
        const tours = await Tour.find({
            startLocation: {
                $geoWithin: {
                    $centerSphere: [[long, lat], radius]
                }
            }
        })
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                data: tours
            }
        })
    }
    catch (err) {
        return next(err);
    }
}