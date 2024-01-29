const { Cart } = require('../model/cart');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.AddItemToUser = async (req, res) => {
    console.log(req.user,"requser at 06");
    const cart = req.user;
    const cartData=new Cart({...req.body,userId:req.user.id});
  await cartData.save();
    console.log(cartData,"cartData at 8")
    res.status(200)
      .json({ status:"success",message:"Successfully Added to Cart" });
  };

  exports.fetchCartItems = async (req, res) => {
    try{
        console.log(req.user,"requser at 06");
        const item = req.user;
        const itemData=await Cart.find({userId:req.user.id})
        console.log(itemData,"itemData at 8")
        res.status(200)
          .json({  status:true,data: itemData });
    }catch(error){
        console.error(error);
        res.status(500).json({ status: false });
    }
    
  };