const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },

  followers: [
    {
      user: { type: Schema.Types.ObjectId, ref: "Users" },
    },
  ],

  following: [
    {
      user: { type: Schema.Types.ObjectId, ref: "Users" },
    },
  ],
});

module.exports = mongoose.model("Follower", FollowerSchema);
