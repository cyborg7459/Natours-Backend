const appError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => {
    return async (req,res, next) => {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);
            if(!doc) {
                return next(new appError('No record found with that ID', 404));
            }
            res.status(204).json({
                status: 'Success',
                data: null
            })
        }
        catch (err) {
            res.status(400).json({
                status: 'Failure',
                message: err
            })
        }
}};

exports.updateOne = Model => {
    return async (req,res, next) => {
        try {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true  // this makes sure that if any validations are present in the model, then they are run at the time of updating tours as well, and not just at the time of creating them
            });
            if(!doc) {
                return next(new appError('No record found with that ID', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    data : doc
                }
            })
        }
        catch (err) {
            next(err);
        }
    }
}

exports.createOne = Model => {
    return async (req,res,next) => {
        try {
            const newDoc = await Model.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    data: newDoc
                }
            })
        }
        catch (err) {
            next(err);
        }
    }
}

exports.getOne = (Model, populateOptions) => {
    return async (req,res,next) => {
        try {
            let query = Model.findById(req.params.id);
            if(populateOptions)
                query = query.populate(populateOptions);
            const doc = await query;
            if(!doc) {
                return next(new appError('No record found with that ID', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    data: doc
                }
            })
        }
        catch (err) {
            next(err);
        }
    }
}

exports.getAll = Model => {
    return async (req,res) => {
        try {
            let filter = {};
            if(req.params.tourId) {
                filter = {forTour : req.params.tourId};
            }
            const features = new APIFeatures(Model.find(filter), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            
            const allDocs = await features.query;
    
            res.status(200).json({
                status: 'success',
                results: allDocs.length,
                data: {
                    data: allDocs
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
}