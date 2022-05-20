const mongoose = require("mongoose");
const { isValidMail } = require('../utils/validation.utils');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
