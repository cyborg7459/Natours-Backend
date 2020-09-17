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

exports.addTour = async (req,res) => {
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
        res.status(400).json({
            status: 'failure',
            message: err
        })
    }
}

exports.getSingleTour = async (req,res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

exports.updateTour =  async (req,res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
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

exports.deleteTour = async (req,res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
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