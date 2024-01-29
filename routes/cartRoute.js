const express = require('express');
const router = express.Router();
const {AddItemToUser,fetchCartItems}=require("../controller/Cart")
const passport = require('passport');


router.post('/additemtouser', passport.authenticate('jwt'), AddItemToUser).get('/fetchCartItems', passport.authenticate('jwt'), fetchCartItems)

module.exports = router;