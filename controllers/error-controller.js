const appError = require("../utils/appError")

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError(message, 400);
}

const handleDuplicateErrorDB = err => {
    const message = `Can't have same name for multiple tours`;
    return new appError(message, 400);
}

const handleValidationError = err => {
    const message = err.message.split(',')[0].split(':')[2].trim();
    return new appError(message, 400);
}

const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const prodError = (err,res) => {
    if(err.isOperational) {             // We don't need the customer to know the error if there's some error in programming or anything. Only operational errors like 404 not found or bas request need to be displayed in the production site
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err
        })
    }
    else {
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development') 
        devError(err, res);
    else {
        let error = { ...err };
        if(err.stack.startsWith('CastError'))
            error = handleCastErrorDB(error);
        else if(err.code === 11000)
            error = handleDuplicateErrorDB(error);
        else if(err.message.includes("validation failed")) {
            error.message = err.message;
            error = handleValidationError(error);          
        }
        prodError(error, res);
    }
}
