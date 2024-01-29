const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
name:{type:String,required:true},
  imageUrl: { type: String, required: true },
  price:{type:Number,required:true},
},{timestamps: true});

const virtual = cartSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model('Cart', cartSchema);
