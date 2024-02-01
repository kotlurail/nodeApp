const { User } = require("../model/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.fetchUserDetails = async (req, res) => {
  // console.log(req.user,"requser at 06");
  const user = req.user;
  const userData = await User.findOne({ _id: user.id });
  console.log("userData at 8");
  res.status(200).json({ name: userData.name, Email: userData.email });
};
