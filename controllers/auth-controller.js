const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const appError = require('../utils/appError');

const createToken = id => {
    console.log(process.env.JWT_EXPIRY);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

exports.signup = async (req,res,next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passconf: req.body.passconf
        });
        const token = createToken(newUser._id);
        res.status(201).json({
            status: 'Success',
            token,
            data: {
                user: newUser
            }
        })
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
        
        const token = createToken(user._id);
        res.status(200).json({
            status: 'Success',
            token
        })
    }
    catch (err) {
        next(err);
    }
}

exports.protect = async (req,res,next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token)
            return next(new appError('You are not logged in', 401));
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err)
                return next(err);
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    catch (err) {
        next(err);
    } 
}
