const mongoose = require('mongoose');
const Asset = require('../models/asset.model');
const Notification = require('../models/notification.model');
const { isValidGeoroute, isClosed } = require('../utils/validation.utils');
const { isLocationOnPath } = require('../utils/georoute.utils');
const { emitNotification } = require('../index');


exports.addGeoroute = async (req, res) => {
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

        if(!req.body.georoute){
            return res.status(400).send({
                message: "Please provide a georoute or query"
            });
        }
        
        if(!isValidGeoroute(req.body.georoute.coordinates)){
            return res.status(400).send({
                message: "Invalid georoute coordinates,  check range of coordinates or format of the payload"
            });        
        }
        
        if(isClosed(req.body.georoute.coordinates)){
            return res.status(400).send({
                message: "Georoute shouldn't be closed"
            }); 
        }
        asset.georoute = req.body.georoute;

        //georoute 
        let point = asset.location.coordinates, polyline = asset.georoute.coordinates;
        
        if(!isLocationOnPath(point, polyline, false, 30)){
            const notification = new Notification({
                description : "Anomaly detected : Asset has deviated from preset georoute",
                assetId : asset._id,
                assetName : asset.name,
                location : asset.location.coordinates,
                time : asset.location.createdAt
            });
            await notification.save();
            emitNotification("georouteAnomaly", notification);
        }

        await asset.save();
        
        res.status(201).send({ message : 'Georoute is modified' });
    } catch(err){
        res.status(400).send({ message : err.message })
    }
}

exports.deleteGeoroute = async (req, res) => {
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

        asset.georoute = undefined;

        await asset.save();
        res.status(201).send({ message : 'Georoute is deleted' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}