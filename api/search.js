const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/userModel");

router.get("/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  if (searchText.length === 0) return;

  try {
    const results = await UserModel.find({
      name: { $regex: searchText, $options: "i" },
    });
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
