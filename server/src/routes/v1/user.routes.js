const express = require('express');
const router = express.Router();
const { addUser, loginUser, logoutUser, checkUser } = require('../../controllers/user.controller');


/**
 * @route     POST /api/v1/user/signup
 * @desc      registers user
 * @access    Public
 */
router.post("/signup", addUser);


/**
 * @route     POST /api/v1/user/login
 * @desc      logs user in
 * @access    Public
 */
router.post("/login", loginUser);


/**
 * @route     GET /api/v1/user/logout
 * @desc      logs user out
 * @access    Public
 */
router.get("/logout", logoutUser);


/**
 * @route     GET /api/v1/user
 * @desc      checks current user
 * @access    Public
 */
router.get("/", checkUser);

module.exports = router;