const mongoose = require("mongoose");
require("dotenv").config();
async function connectDatabase() {
  const mongoUri =
    process.env.NODE_ENV === "PROD"
      ? process.env.MONGO_URI_PROD
      : process.env.NODE_ENV === "DEV"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_TEST;
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDb connected ..."))
    .catch((err) => console.log(err, "Err at 07"));
}
console.log(process.env.MONGO_URL);
module.exports = connectDatabase;
