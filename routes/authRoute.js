const express = require("express");
const passport = require("passport");
const {
  createUser,
  loginUser,
  checkAuth,
  logout,
} = require("../controller/Auth");
const router = express.Router();
//  /auth is already added in base path
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .get("/logout", logout)
  .get("/duplicate", (req, res) => {
    res
      .status(200)
      .json({ name: "Mohan", Email: "mohankumar.kukkala@gmail.com" });
  });
module.exports = router;
