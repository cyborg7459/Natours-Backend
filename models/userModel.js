const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'A user must have a name']
    },
    email: {
        type: String,
        required : [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate : [validator.isEmail, 'Please provide a valid email']
    },
    photo : {
        type: String
    },
    password : {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [8, 'Password must have atleast 8 characters']
    },
    passconf : {
        type: String,
        required: [true, 'A confirmation password must be present']
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;