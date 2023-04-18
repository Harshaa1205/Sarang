const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const FollowerModel = require("../models/followerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const { userId } = req;

  try {
    const user = await UserModel.findById(userId);

    const userFollowStats = await FollowerModel.findOne({ user: userId });

    return res.status(200).json({ user, userFollowStats });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email address");

  if (password.length < 6)
    return res.status(401).send("Password must be at least 6 characters");

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).send("Invalid Email");
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) return res.status(401).send("Invalid Password");

    const payload = { userId: user._id };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(token);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
