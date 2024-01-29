const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
name:{type:String,required:true},
  imageUrl: { type: String, required: true },
  price:{type:Number,required:true},
},{timestamps: true});

const virtual = itemSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
itemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Item = mongoose.model('Item', itemSchema);
