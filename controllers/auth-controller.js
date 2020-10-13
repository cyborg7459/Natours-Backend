const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = async (req,res,next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passconf: req.body.passconf
        });
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRY 
        })
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