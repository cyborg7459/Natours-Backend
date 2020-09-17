const Tour = require('./../models/tourModel');

// ROUTE HANDLERS

exports.getAllTours = async (req,res) => {
    try {
        const allTours = await Tour.find(req.query);
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