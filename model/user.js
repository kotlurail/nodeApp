const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
name:{type:String,required:true},
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default:'user' },
  phone:{type:Number,required:true,unique:true},
  salt: Buffer,
  region:{type:String,required:true}
},{timestamps: true});

const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model('User', userSchema);
