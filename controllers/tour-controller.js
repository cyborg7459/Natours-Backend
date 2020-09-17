const Tour = require('./../models/tourModel');

// ROUTE HANDLERS

exports.getAllTours = async (req,res) => {
    try {
        // Build a query 
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // Sorting
        if(req.query.sort) {
            let sortArray = req.query.sort.split(',');
            let sortString = sortArray.join(' ');
            query = query.sort(sortString);
        } else {
            query.sort('-createdAt');
        }

        // Field limiting
        if(req.query.fields) {
            const selectFields = req.query.fields.split(',').join(' ');
            console.log(selectFields);
            query = query.select(selectFields);
        } 
        else {
            query = query.select('-__v');
        }

        // Execute the query
        const allTours = await query;
        
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