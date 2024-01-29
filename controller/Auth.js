const { User } = require("../model/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    // console.log(req.body, "reqbody at 7");
    const salt = crypto.randomBytes(16);
    //   console.log(salt,"salt at 08")
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          // Handle the error from pbkdf2
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        try {
          const user = new User({
            ...req.body,
            password: hashedPassword,
            salt,
          });
          const doc = await user.save();
          // console.log(doc, "doc at 19");
          res.status(200).json({ id: doc.name, email: doc.email });
          // Alternatively, you can use res.sendStatus(200) instead of res.status(200).json({...})
        } catch (saveError) {
          console.error(saveError);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Bad Request" });
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 300000000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now() + 360000000),
      httpOnly: true,
    })
    .status(200)
    .json({ status: "loggedOut" });
  // req.logout();

  // Optional: Destroy the session
  // req.session.destroy((err) => {
  //   if (err) {
  //     console.error('Error destroying session:', err);
  //   } else {
  //     // Redirect or respond as needed after logout
  //     res.json({ message: 'Logout successful' });
  //   }
  // });
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
