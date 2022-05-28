const express = require('express');
const { token } = require('morgan');
const router = express.Router();
const { getAssets, getOneAsset, addAsset, updateAsset, trackAsset, deleteAsset } = require('../../controllers/asset.controller');
const { addGeofence, deleteGeofence } = require('../../controllers/geofence.controller');
const { addGeoroute, deleteGeoroute } = require('../../controllers/georoute.controller');
const { tokenVerify } = require('../../middlewares/auth');


/**
 * @route     POST /api/v1/asset
 * @desc      adds asset to database
 * @access    Public
 */
router.post('/', addAsset);


/**
 * @route     GET /api/v1/asset/list
 * @desc      gets all asset and filter them
 * @access    Private
 */
router.get('/list', tokenVerify , getAssets);


/**
 * @route     GET /api/v1/asset/:id
 * @desc      gets one specific asset
 * @access    Private
 */
router.get('/:id', tokenVerify , getOneAsset);


/**
 * @route     GET /api/v1/asset/:id/track
 * @desc      tracks route of an asset (24 hr)
 * @access    Private
 */
router.get('/:id/track', tokenVerify , trackAsset);


/**
 * @route     PATCH /api/v1/asset/:id
 * @desc      updates current location of an asset
 * @access    Public
 */
router.patch('/:id', updateAsset);


/**
 * @route     DELETE /api/v1/asset/:id
 * @desc      deletes an asset
 * @access    Public
 */
router.delete('/:id', tokenVerify, deleteAsset);

// geofence
router.patch('/:id/geofence', tokenVerify, addGeofence);

router.patch('/:id/geofence/remove', tokenVerify,  deleteGeofence);

// georoute
router.patch('/:id/georoute', tokenVerify, addGeoroute);

router.patch('/:id/georoute/remove', tokenVerify, deleteGeoroute);

module.exports = router;
