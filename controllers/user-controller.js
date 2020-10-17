const appError = require('../utils/appError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    Object.keys(obj).forEach(key => {
        if(allowedFields.includes(key))
            newObj[key] = obj[key];
    })
    return newObj;
}

exports.getAllUsers = async (req,res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            status: "success",
            data : {
                users
            }
        })
    }
    catch (err) {
        next(err);
    }
}

exports.addUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route not implemented yet'
    })
}

exports.updateUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route not implemented yet'
    })
}

exports.getSingleUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route not implemented yet'
    })
}

exports.deleteUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route not implemented yet'
    })
}

exports.updateMe = async (req, res, next) => {
    try {
        if(req.body.password || req.body.passconf)
            return next(new appError('This route is not for password updates.\n Plaese use /updatePassword', 400));
        let filteredBody = filterObj(req.body, 'name', 'email');
        const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                user : updatedUser
            }
        })
    }
    catch (err) {
        return next(err);
    }
}

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { active: false });
        res.status(204).json({
            status: 'success',
            message: 'User deleted successfully',
            data: null
        })
    }
    catch (err) {
        next(err);
    }
}