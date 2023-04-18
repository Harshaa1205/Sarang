const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const ProfileModel = require("../models/profileModel");
const FollowerModel = require("../models/followerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");
const userPng =
  "https://res.cloudinary.com/dk6brgbg5/image/upload/v1681299133/samples/profile-placeholder_dcdj6r.jpg";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  console.log("************************", req.params);

  try {
    if (username.length < 1) return res.status(401).send("Invalid");

    if (!regexUserName.test(username)) return res.status(401).send("Invalid");

    const user = await UserModel.findOne({ username: username.toLowerCase() });

    if (user) return res.status(200).send("Username already taken");

    return res.status(200).send("Available");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.post("/", async (req, res, next) => {
  const {
    name,
    email,
    username,
    password,
    bio,
    facebook,
    youtube,
    twitter,
    instagram,
  } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  if (password.length < 6) {
    return res.status(401).send("Password must be atleast 6 characters");
  }
  try {
    let user = await UserModel.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(401).send("User already registered");
    }

    user = await UserModel.findOne({ username: username.toLowerCase() });
    if (user) {
      return res.status(401).send("Username already taken");
    }

    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
      username: username.toLowerCase(),
      profilePicUrl: req.body.profilePicUrl || userPng,
    });

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    let profileFields = {};

    profileFields.user = user._id;
    profileFields.bio = bio;
    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    await new ProfileModel(profileFields).save();
    await new FollowerModel({
      user: user._id,
      followers: [],
      following: [],
    }).save();

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
    res.status(500).send("server error");
  }
});

module.exports = router;
