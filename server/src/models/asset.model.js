const mongoose = require('mongoose');


const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true
    },
    description: {
        type : String,
        //required : true
    }
});

pointSchema.set('timestamps', true);

const polygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]],
        required: true
    }
});

const polylineSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['LineString'],
        required: true
    },
    coordinates: {
        type: [[Number]],
        required: true
    }
});

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location:pointSchema,
    route:[pointSchema],
    assetType: {
        type: String,
        enum: ['truck', 'salesman'],
        required: true
    },
    geofence: polygonSchema,
    georoute: polylineSchema
})

assetSchema.set('timestamps', true);




const Asset = mongoose.model('Asset', assetSchema);


module.exports = Asset


