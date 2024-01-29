require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const connectDatabase = require("./utils/connect");

const { isAuth, sanitizeUser, cookieExtractor } = require("./utils/common");
const searchController = require("./routes/itemRoute");
const path = require("path");
const { env } = require("process");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const itemRoutes = require("./routes/itemRoute");
const cartRoutes = require("./routes/cartRoute");
const { User } = require("./model/user");
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;
server.use(express.static(path.resolve(__dirname, "build")));
server.use(cookieParser());

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      maxAge: 300000000, // session expires in 24 hours
    },
  })
);

server.use(passport.authenticate("session"));
server.use(cors());
server.use("/item/searchitem", searchController);
//   server.options('*', cors());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
server.use(bodyParser.json({ limit: "10mb" }));
server.use("/auth", authRoutes);
server.use("/user", userRoutes);
server.use("/item", itemRoutes);
server.use("/cart", cartRoutes);
server.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    // console.log({ email, password }, "mohan");
    try {
      // console.log(User, "User at 55");
      const user = await User.findOne({ email: email }); // Use findOne instead of find
      // console.log(email, password, user, "71");

      if (!user) {
        return done(null, false, { message: "Invalid credentials" }); // for safety
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }

          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          // console.log(
          //   { id: user.id, role: user.role, token },
          //   "{ id: user.id, role: user.role, token }"
          // );
          done(null, { id: user.id, role: user.role, token }); // this line sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      // console.log(user, "user at 93");
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

connectDatabase();
server.listen(process.env.PORT, () => {
  console.log("server started", process.env.PORT);
});
