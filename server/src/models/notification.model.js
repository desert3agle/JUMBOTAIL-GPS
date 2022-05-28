const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: true
    },
    assetId : {
        type: String,
        required: true
    },
    assetName : {
        type: String,
        required: true
    },
    location: {
        type: Array,
        required: true
    },
    time : {
        type: Date,
        required: true
    }
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;