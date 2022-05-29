const mongoose = require('mongoose');
const Asset = require('../models/asset.model');
const {isClosed, isValidGeofence } = require('../utils/validation.utils')
const { containsLocation } = require('../utils/geofence.utils')
const { emitNotification } = require('../index');

exports.addGeofence = async (req, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }
        let asset = await Asset.findById(req.params.id);
        
        if(!asset){
            return res.status(404).send({
                message: "Asset with given ID not found"
            })
        }

        if(!req.body.geofence){
            return res.status(400).send({
                message: "Please provide a geofence or query"
            });
        }

        if(!isValidGeofence(req.body.geofence.coordinates)){
            return res.status(400).send({
                message: "Invalid geofence coordinates, check range of coordinates or format of the payload"
            });      
        }

        if(!isClosed(req.body.geofence.coordinates)){
            return res.status(400).send({
                message: "Geofence isn't closed (first and last coordinates should be same)"
            });           
        }


        asset.geofence = req.body.geofence;

        //geofence
        let longitude = asset.location.coordinates[0], latitude = asset.location.coordinates[1], polygon = asset.geofence.coordinates;

        if(!containsLocation(latitude, longitude, polygon)){
            const notification = {
                description : "Anomaly detected : Asset is outside geofence",
                assetId : asset._id,
                assetName : asset.name,
                location : asset.location.coordinates,
                time : asset.location.createdAt
            };
            emitNotification("geofenceAnomaly", notification);
        }
                
        await asset.save();
        res.status(201).send({ message : 'Geofence is modified' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}

exports.deleteGeofence = async (req, res) => {
    try{

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }
        let asset = await Asset.findById(req.params.id);
        
        if(!asset){
            return res.status(404).send({
                message: "Asset with given ID not found"
            })
        }

         asset.geofence = undefined;

        await asset.save();
        res.status(201).send({ message : 'Geofence is deleted' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}