const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
        type: String,
        enum: {
            values : ['user', 'guide', 'lead-guide', 'admin'],
            message : 'An account can be either of user; guide; lead-guide or admin'
        },
        default: 'user'
        
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
    },
    passwordChangedAt : {
        type: Date
    },
    passwordResetToken : {
        type: String
    },
    passwordResetExpires : {
        type: Date
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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256')
                                    .update(resetToken)
                                    .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;