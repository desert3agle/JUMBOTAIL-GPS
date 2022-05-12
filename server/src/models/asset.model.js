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

const Point = mongoose.model('Point', pointSchema);

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
    }
})

assetSchema.set('timestamps', true);

const Asset = mongoose.model('Asset', assetSchema);


module.exports = {
  Asset,
  Point
};


