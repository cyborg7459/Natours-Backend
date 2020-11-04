const appError = require('../utils/appError');

exports.deleteOne = Model => {
    return async (req,res, next) => {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);
            if(!doc) {
                return next(new appError('No record found with that ID', 404));
            }
            res.status(200).json({
                status: 'Success',
                message: 'Successfully deleted record'
            })
        }
        catch (err) {
            res.status(400).json({
                status: 'Failure',
                message: err
            })
        }
}};
