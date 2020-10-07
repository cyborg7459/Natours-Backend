class appError extends Error {
    constructor(message, statusCode) {
        super(message);     // Because the parent class Error only expects the error message as the parameter
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failure' : 'Error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = appError;
