const express = require('express');
const router = express.Router();
const { fetchUserDetails } = require('../controller/User');
const passport = require('passport');


router.get('/fetchUserDetails', passport.authenticate('jwt'), fetchUserDetails)

module.exports = router;