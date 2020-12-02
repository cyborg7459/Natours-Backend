const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

const sendToken = (user, statusCode, res) => {
    const token = createToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY *24*60*60*1000),
        httpOnly: true  
    }

    if(process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user
        }
    })
}

exports.signup = async (req,res,next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passconf: req.body.passconf,
            passwordChangedAt: req.body.passwordChangedAt,
            role: req.body.role
        });
        sendToken(newUser, 201, res);
    }
    catch (err) {
        next(err);
    }
}

exports.login = async (req,res,next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new appError('Please provide email and password', 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if(!user || !await user.correctPassword(password, user.password)) {
            return next(new appError('Incorrect email or password', 401));
        }
        sendToken(user, 200, res);
    }
    catch (err) {
        next(err);
    }
}

exports.protect = async (req,res,next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
            token = req.headers.authorization.split(' ')[1];
        else if(req.cookies.jwt)
            token = req.cookies.jwt;
        
            if(!token)
            return next(new appError('You are not logged in', 401));
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err)
                return next(err);
            else {
                const user = await User.findById(decodedToken.id);
                if(!user)
                    return next(new appError('Given user does not exist', 401));
                if(user.changedPasswordAfter(decodedToken.iat))
                    return next(new appError('Password was changed !!! Please login with the latest password', 401));
                req.user = user;
                next();
            }
        })
    }
    catch (err) {
        next(err);
    } 
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

exports.forgotPassword = async (req,res,next) => {
    const user = await User.findOne({ email : req.body.email });
    if(!user) 
        return next(new appError('There is no user with the given email', 404));
    
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave : false });
    
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const message = `Forgot your password?? Create a new password at ${resetURL}. \n Please ignore if you didn't forget your password !!`;
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid only for 10 minutes)',
            message
        })
    }
    catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError('There was an error sending the email!! Please try again', 500));
    }
    sendToken(user, 200, res);
};

exports.resetPassword = async (req,res,next) => {
    try {
        const hashedToken = crypto.createHash('sha256')
                                  .update(req.params.token)
                                  .digest('hex');
        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt : Date.now()}});
        if(!user)
            return next(new appError('Token is either invalid or expired', 400));
        user.password = req.body.password;
        user.passconf = req.body.passconf;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        const token = createToken(user._id);
        res.status(200).json({
            status: 'Success',
            token
        })
    }
    catch(err) {
        next(err);
    }
};

exports.updatePassword = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if(!await user.correctPassword(req.body.currentPassword, user.password))
            return next(new appError('Your current password is wrong', 401));
        user.password = req.body.newPassword;
        user.passconf = req.body.newPassconf;
        await user.save();
        sendToken(user, 200, res);
    }
    catch(err) {
        next(err);
    }
}
