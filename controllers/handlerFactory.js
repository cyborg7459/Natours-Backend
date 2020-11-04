const appError = require('../utils/appError');

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
        console.log(req.body);
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
