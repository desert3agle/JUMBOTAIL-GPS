const express = require('express');
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
 * @access    Private
 */
router.delete('/:id', tokenVerify, deleteAsset);


/**
 * @route     PATCH /api/v1/asset/:id/geofence
 * @desc      adds geofence to an asset
 * @access    Private
 */
router.patch('/:id/geofence', tokenVerify, addGeofence);


/**
 * @route     PATCH /api/v1/asset/:id/geofence/remove
 * @desc      deletes geofence from an asset
 * @access    Private
 */
router.patch('/:id/geofence/remove', tokenVerify,  deleteGeofence);


/**
 * @route     PATCH /api/v1/asset/:id/georoute
 * @desc      adds georoute to an asset
 * @access    Private
 */
router.patch('/:id/georoute', tokenVerify, addGeoroute);


/**
 * @route     PATCH /api/v1/asset/:id/georoute/remove
 * @desc      deletes an asset
 * @access    Private
 */
router.patch('/:id/georoute/remove', tokenVerify, deleteGeoroute);


module.exports = router;
