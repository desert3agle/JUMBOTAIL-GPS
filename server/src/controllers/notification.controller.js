const mongoose = require('mongoose');
const Notification = require('../models/notification.model');

exports.getNotifications = async(req, res) => {
    try{
        let notifications = await Notification.find().sort({_id : -1});
        res.status(200).json(notifications);
    }catch(err){
        res.status(500).send({err : err.message});
    }
}

exports.getNotificationByAsset = async(req, res) => {
    try{
        let assetId = req.params.assetId;
        
        if(!mongoose.Types.ObjectId.isValid(assetId)){
            return res.status(400).send({
                message: "Invalid Asset ID"
            })
        }
        let notifications = await Notification.find();

        let response = [];
        for(let i = 0; i < notifications.length; i++){
            if(notifications[i].assetId == assetId) response.push(notifications[i]);
        }
        res.status(200).json(response);
    }catch(err){
        res.status(500).send({err : err.message});
    }
}

exports.getOneNotification = async(req, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                message: "Invalid Notification ID"
            })
        }
        let notification = await Notification.findById(req.params.id);

        if(!notification){
            return res.status(404).send({
                message: "Notification with given ID not found"
            })
        }

        res.status(200).json(notification);
   }catch(err) {
        res.status(500).send({ message : err.message });
   }
};
