const mongoose=require('mongoose')
require('dotenv').config();
async function connectDatabase(){
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDb connected ..."))
    .catch((err) => console.log(err,"Err at 07"));
}
console.log(process.env.MONGO_URL);
module.exports = connectDatabase;



