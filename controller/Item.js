const { Item } = require("../model/item");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.fetchItems = async (req, res) => {
  try {
    // console.log(req.user, "requser at 06");
    const item = req.user;
    const itemData = await Item.find({});
    // console.log(itemData, "itemData at 8");
    res.status(200).json({ status: true, data: itemData });
  } catch (error) {
    console.error(saveError);
    res.status(500).json({ status: false });
  }
};

exports.addItems = async (req, res) => {
  // console.log(req.user, "requser at 06");
  const item = req.user;
  try {
    const item = new Item({ ...req.body });
    const doc = await item.save();
    // console.log(doc, "doc at 19");
    res.status(200).json({ status: "Successfully added Item" });
    // Alternatively, you can use res.sendStatus(200) instead of res.status(200).json({...})
  } catch (saveError) {
    // console.error(saveError);
    res.status(500).json({ status: "Failed to Add Item" });
  }
};
exports.searchItems = async (req, res) => {
  const query = req.query.q;
  // console.log(query, "query at 34");
  try {
    const results = await Item.find({
      name: { $regex: query, $options: "i" },
    });
    // console.log(results, "results at 39");
    res.status(200).json({ status: "Successfully added Item", data: results });
  } catch (error) {
    // console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
