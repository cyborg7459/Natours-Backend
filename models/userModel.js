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
        // Since we need this validation to run even during update password, thus we never use findAndUpdate or similar functions, instead we make the changes and use the user.save() function so that all validators and pre-save hooks (like password hashing one) are run before saving the new credentials
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Password and confirm password do not match'
        }
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
    active : { 
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passconf = undefined;
    next();
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew)
        return next();
    else {
        // We subtract one second because sometimes what happens is that this Date.now() function runs after the JWT is created, thus to the server it would mean that the password has changed after the JWT was issued, and would thus restrict the user from accessing different routes
        this.passwordChangedAt = Date.now() - 1000;
        next();
    }
})

userSchema.pre(/^find/, function(next) {
    this.find({ active: true });
    next();
});

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