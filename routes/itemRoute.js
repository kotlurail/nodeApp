const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { fetchItems, addItems, searchItems } = require("../controller/Item");
const passport = require("passport");
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum requests per windowMs
  message: "Too many search requests from this IP, please try again later",
});
router
  .get("/fetchItems", passport.authenticate("jwt"), fetchItems)
  .post("/addItem", passport.authenticate("jwt"), addItems)
  .get("/searchitem", searchLimiter, passport.authenticate("jwt"), searchItems);

module.exports = router;
