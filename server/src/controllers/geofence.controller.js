const Asset = require('../models/asset.model');
const mongoose = require('mongoose');



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
                message: "please provide a geofence"
            });
        }

        asset.geofence = req.body.geofence;

        await asset.save();
        res.status(201).send({ message : 'updated' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}