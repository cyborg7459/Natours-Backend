const Tour = require('../models/tourModel');

exports.getOverview = async (req,res, next) => {
    try {
        const tours = await Tour.find();
        res.status(200).render('overview', {
            title: 'All tours',
            tours
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.getTour =  (req,res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker'
    });
}