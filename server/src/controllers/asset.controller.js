const Asset = require('../models/asset.model');
const { isIsoDate } = require('../utils/validation.utils');
const mongoose = require('mongoose');
const { containsLocation } = require('../utils/geofence.utils');
const { isLocationOnPath } = require('../utils/georoute.utils'); 

exports.addAsset = async(req, res) => {
    try{
        const asset = new Asset({
            name : req.body.name,
            assetType : req.body.assetType,
            location : {
                type : req.body.location.type,
                coordinates : req.body.location.coordinates,
                description : req.body.location.description
            }
        });
        asset.route.push(req.body.location);
        let saved = await asset.save();
        
        res.status(201).json({ id: saved._id });
    }catch(err){
        res.status(400).send({message : err.message});
    }
};

exports.getAssets = async(req, res) => {
    try{
        let {startTime, endTime, assetType, maxLimit} = req.query
        
        if(maxLimit === undefined) maxLimit = 100;

        if(startTime){
            if(isIsoDate(startTime)) startTime =  new Date(startTime);
            else {
                return res.status(400).send({
                    message: "Invalid Start Time"
                });
            }
        } else {
            startTime = new Date(-8640000000000000);
        }

        if(endTime){
            if(isIsoDate(endTime)) endTime = new Date(endTime);
            else {
                return res.status(400).send({
                    message: "Invalid End Time"
                });
            }
        } else {
            endTime = new Date();
        }

        
        let assets = await Asset.find({
            updatedAt : {
                $gte : startTime, 
                $lte : endTime
            }
        })
        .limit(maxLimit)
        .sort({updatedAt : -1});


        let response  = [];
        
        if(assetType !== undefined){
            for(let i = 0; i < assets.length; i++){
                if(assets[i].assetType === assetType) response.push(assets[i]);
            }
        } else response = assets;

        res.status(200).json(response);
    }catch(err){
        res.status(500).send({err : err.message});
    }
};

exports.getOneAsset = async(req, res) => {
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

        res.status(200).json(asset);
   }catch(err) {
        res.status(500).send({ message : err.message });
   }
};


exports.trackAsset = async(req, res) => {
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
        
        let {startTime, endTime} = req.query;

        if(endTime){
            if(isIsoDate(endTime)) endTime = new Date(endTime);
            else {
                return res.status(400).send({
                    message: "Invalid End Time"
                })
            }
        } else {
            endTime = new Date();
        }

        if(startTime){
            if(isIsoDate(startTime)) startTime =  new Date(startTime);
            else {
                return res.status(400).send({
                    message: "Invalid Start Time"
                })
            }
        } else {
            startTime = new Date(endTime.getTime() - 1000 * ( 24 * 60 * 60 ));
        }
        
        const response = [];

        for(let i = 0; i < asset.route.length; i++) {
            let currTime = asset.route[i].createdAt;
            if(currTime >= startTime && currTime <= endTime) response.push(asset.route[i]);
        }

        res.status(200).json(response);
   }catch(err) {
        res.status(500).send({ message : err.message });
   }
};

exports.updateAsset = async (req, res) => {
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
            });
        }

        if(!req.body.location){
            return res.status(400).send({
                message: "please provide a location"
            });
        }

        asset.location = req.body.location;
        asset.route.push(req.body.location);
        
        await asset.save();

        //geofence
        if(asset.geofence !== undefined){
            if(asset.geofence.coordinates.length > 0){
                let longitude = asset.location.coordinates[0], latitude = asset.location.coordinates[1], polygon = asset.geofence.coordinates[0];

                if(containsLocation(latitude, longitude, polygon)){
                    console.log("andar hai");
                }else{
                    console.log("bahar hai");
                }
            }
        }
        //georoute
        if(asset.georoute !== undefined){
            if(asset.georoute.coordinates.length > 0){
                let point = asset.location.coordinates, polyline = asset.georoute.coordinates;
                if(isLocationOnPath(point, polyline, false, 30)){
                    console.log("line par hai")
                }
                else {
                    console.log("bahar hai");
                }
            }
        }
        res.status(201).send({ message : 'location is updated' });
    }catch(err){
        res.status(400).send({ message : err.message });
    }
};

exports.deleteAsset = async (req, res) => {
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
        await Asset.deleteOne({ _id: req.params.id });
        res.status(200).send({ message : 'deleted' });
    }catch(err){
        res.status(500).send({ message : err.message });
    }
}