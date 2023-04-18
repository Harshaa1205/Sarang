import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import Cookies from "js-cookie";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: Cookies.get("token") },
});

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPost,
  setNewPost,
  setError
) => {
  try {
    const res = await Axios.post("/", { text, location, picUrl });

    setPost((prev) => [res.data, ...prev]);
    setNewPost({ text: "", location: "" });
  } catch (error) {
    const errorMessage = catchErrors(error);
    setError(errorMessage);
  }
};

export const deletePost = async (postId, setPost, setShowToaster) => {
  try {
    await Axios.delete(`/${postId}`);
    setPost((prev) => prev.filter((post) => post._id !== postId));
    setShowToaster(true);
  } catch (err) {
    alert(catchErrors(err));
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);
      setLikes((prev) => [...prev, { user: userId }]);
    } else if (!like) {
      await Axios.put(`/unlike/${postId}`);
      setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const postComment = async (postId, user, text, setComments, setText) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });

    const newComment = {
      _id: res.data,
      user,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);

    setText("");
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const deleteComment = async (
  postId,
  commentId,
  setComments,
  setDisabled
) => {
  try {
    await Axios.delete(`/${postId}/${commentId}`);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    setDisabled(false);
  } catch (error) {
    alert(catchErrors(error));
  }
};
