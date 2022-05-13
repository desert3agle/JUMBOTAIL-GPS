const { Asset, Point } = require('../models/asset.model');

exports.getAssets = async(req, res) => {
    try{
        let {startTime, endTime, assetType, maxLimit} = req.query
        
        let assets = [];

        if(maxLimit === undefined) maxLimit = 100;

        if(startTime !== undefined || endTime !== undefined){

            function isIsoDate(str) {
                if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
                let d = new Date(str); 
                return d.toISOString()===str;
            }

            if(startTime){
                (isIsoDate(startTime)) ? startTime =  new Date(startTime) : startTime = new Date(-8640000000000000);
            } else {
                startTime = new Date(-8640000000000000);
            }

            if(endTime){
                (isIsoDate(endTime)) ? endTime = new Date(endTime) : endTime = new Date();
            } else {
                endTime = new Date();
            }

            assets = await Asset.find({
                updatedAt : {
                    $gte : startTime, 
                    $lte : endTime
                }
            })
            .limit(maxLimit)
            .sort({updatedAt : -1});

        } else {
            assets = await Asset.find().limit(maxLimit).sort({updatedAt : -1})
        }

        let response  = [];
        
        if(assetType !== undefined){
            for(let i = 0; i < assets.length; i++){
                if(assets[i].assetType === assetType) response.push(assets[i]);
            }
        } else response = assets;

        res.status(200).json(response);
    }catch(err){
        res.status(500).json({err : err.message});
    }
};

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
        res.status(400).type("txt").send(err.message);
    }
};

exports.updateAsset = async(req, res) => {

    try{
        const locationPoint = new Point({
            type : req.body.location.type,
            coordinates : req.body.location.coordinates,
            description : req.body.location.description
        });
        await Point.validate(locationPoint);
    } catch(err){
        return res.status(400).type("txt").send(err.message);
    }

    try{
        const response = await Asset.updateOne(
            { _id: req.params.id },
            {
            $set: {
                location : req.body.location
            },
            $push: {
                route: req.body.location
            }
        });
        res.status(201).send('updated');
    }catch(err){
        res.status(404).type("txt").send(err.message);
    }
};

exports.getOneAsset = async(req, res) => {
    try{
        let response = await Asset.findById(req.params.id);
        res.status(200).json(response);
   }catch(err) {
        res.status(404).type("txt").send(err.message);
   }
};

exports.trackAsset = async(req, res) => {
    try{
        let endDate = new Date(), startDate = new Date(endDate.getTime() - 1000 * 86400);

        let response = await Asset.find(
            { _id: req.params.id },
            {route : [{
                    createdAt : {$gte : startDate, $lte : endDate}
                }]
            })
        res.status(200).json(response);
   }catch(err) {
        res.status(404).type("txt").send(err.message);
   }
}
