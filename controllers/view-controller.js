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

exports.getTour = async (req,res,next) => {
    try {
        const tour = await Tour.findOne({slug: req.params.tourName}).populate({
            path: 'reviews',
            fields: 'review rating byUser'
        });
        res.status(200).render('tour', {
            title: `${tour.name} Tour`,
            tour
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.loginPage = (req,res) => {
    res.status(200).render('login', {
        title: 'Login'
    })
}