const express = require('express');
const router = express.Router();
const { getNotifications, getNotificationByAsset, getOneNotification } = require('../../controllers/notification.controller');
const { tokenVerify } = require('../../middlewares/auth');


router.get('/list', tokenVerify , getNotifications);


router.get('/asset/:assetId', tokenVerify , getNotificationByAsset);


router.get('/:id', tokenVerify , getOneNotification);


module.exports = router;