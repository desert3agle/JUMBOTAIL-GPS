const express = require('express');
const router = express.Router();
const { getAssets, getOneAsset, addAsset, updateAsset, trackAsset, deleteAsset } = require('../../controllers/asset.controller');
const { addGeofence } = require('../../controllers/geofence.controller');
const { addGeoroute } = require('../../controllers/georoute.controller');
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
router.delete('/:id', deleteAsset);


router.patch('/:id/geofence', addGeofence);

router.patch('/:id/georoute', addGeoroute);

module.exports = router;
