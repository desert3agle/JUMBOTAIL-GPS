const Asset = require('../models/asset.model');
const mongoose = require('mongoose');
const { isValidGeoroute, isClosed } = require('../utils/validation.utils');

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
                message: "please provide a georoute or query"
            });
        }
        
        if(!isValidGeoroute(req.body.georoute.coordinates)){
            return res.status(400).send({
                message: "invalid georoute coordinates,  check range of coordinates or format of the payload"
            });        
        }
        
        if(isClosed(req.body.georoute.coordinates)){
            return res.status(400).send({
                message: "georoute shouldn't be closed"
            }); 
        }
        asset.georoute = req.body.georoute;

        await asset.save();
        
        res.status(201).send({ message : 'georoute is modified' });
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
        res.status(201).send({ message : 'georoute is deleted' });
    }catch(err){
        res.status(400).send({ message : err.message })
    }
}