const express = require('express');
const router = express.Router();
const { addUser, loginUser } = require('../../controllers/user.controller');


/**
 * @route     POST /api/v1/user
 * @desc      registers users
 * @access    Public
 */
router.post("/signup", addUser);


/**
 * @route     POST /api/v1/user
 * @desc      logs user in
 * @access    Public
 */
router.post("/login", loginUser);
  

module.exports = router;