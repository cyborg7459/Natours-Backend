const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        minlength: [8, 'Password must have atleast 8 characters'],
        select: false
    },
    passconf : {
        type: String,
        required: [true, 'A confirmation password must be present'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Password and confirm password do not match'
        }
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passconf = undefined;
    next();
})

userSchema.methods.correctPassword = function(password, userPassword) {
    return bcrypt.compare(password, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;