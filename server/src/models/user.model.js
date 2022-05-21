const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    first_name: { 
        type: String, 
        default: null 
    },
    last_name: { 
        type: String, 
        default: null 
    },
    email: { 
        type: String, 
        unique: true
    },
    password: { 
        type: String
    },
    token: { 
        type: String 
    },
});


userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('email is not registered');
};

userSchema.methods.toJSON = function() {
    const user = this 
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    return userObject
}

const User = mongoose.model('User', userSchema);

module.exports = User;
