const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const FollowerModel = require("../models/followerModel");
const PostModel = require("../models/postModel");
const authMiddleware = require("../middleware/authMiddleware");
const uuid = require("uuid").v4;

// add post, get all post, get post by user id, delete post by post id.

router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length < 1)
    return res.status(500).send("Text must be at least 1 character long");

  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await new PostModel(newPost).save();

    const postCreated = await PostModel.findById(post._id).populate("user");

    return res.status(201).json(postCreated);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const { pageNumber } = req.query;

  const number = Number(pageNumber);
  const size = 8;

  try {
    let post;

    if (number === 1) {
      post = await PostModel.find()
        .limit(size)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
    } else {
      const skips = size * (number - 1);
      post = await PostModel.find()
        .skip(skips)
        .limit(size)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user")
      .populate("comments.user");

    if (!post) return res.status(404).send("Post not found");

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    console.log({ post });
    if (!post) return res.status(404).send("Post not found");

    const user = await UserModel.findById(userId);

    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.deleteOne();
        return res.status(200).send("Post deleted successfully");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }

    await post.deleteOne();
    return res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

// like a post, unlike a post, get all likes on a post.

router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(401).send("Post not found");

    const isLiked = post.likes.some((like) => like.user.toString() === userId);

    if (isLiked) return res.status(401).send("Post liked already");

    post.likes.unshift({ user: userId });
    await post.save();

    return res.status(201).send("Post liked successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(401).send("Post not found");

    const isNotLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;

    if (isNotLiked) return res.status(401).send("Post wasn't liked before");

    const currUsersLikeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    post.likes.splice(currUsersLikeIndex, 1);

    await post.save();

    return res.status(201).send("Post unliked successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate("likes.user");

    if (!post) return res.status(401).send("Post not found");

    return res.status(200).json(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

// add comments to post, delete comment

router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const { text } = req.body;

    if (text.length < 1)
      res.status(401).send("Comment should be at least 1 character long");

    const post = await PostModel.findById(postId);

    if (!post) return res.status(401).send("Post not found");

    const newComment = {
      _id: uuid(),
      text,
      user: req.userId,
      date: Date.now(),
    };

    post.comments.unshift(newComment);
    await post.save();

    return res.status(200).json(newComment._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) res.status(404).send("No Comment found");

    const user = await UserModel.findById(userId);

    const deleteComment = async () => {
      const commentIndex = post.comments
        .map((comment) => comment._id)
        .indexOf(commentId);
      post.comments.splice(commentIndex, 1);
      await post.save();

      return res.status(200).send("Comment deleted successfully");
    };

    if (comment.user.toString() !== userId) {
      if (user.role === "root") await deleteComment();
      else {
        return res.status(401).send("Unauthorized");
      }
    }

    await deleteComment();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
