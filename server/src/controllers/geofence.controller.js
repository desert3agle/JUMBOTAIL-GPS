const Asset = require('../models/asset.model');
const mongoose = require('mongoose');
const {isClosed, isValidGeofence } = require('../utils/validation.utils')


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
                message: "please provide a geofence or query"
            });
        }

        if(!isValidGeofence(req.body.geofence.coordinates)){
            return res.status(400).send({
                message: "invalid geofence coordinates, check range of coordinates or format of the payload"
            });      
        }

        if(!isClosed(req.body.geofence.coordinates)){
            return res.status(400).send({
                message: "geofence isn't closed (first and last coordinates should be same)"
            });           
        }


        asset.geofence = req.body.geofence;

        await asset.save();
        res.status(201).send({ message : 'geofence is modified' });
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
        res.status(201).send({ message : 'geofence is deleted' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}