import React from "react";
import { Modal, Image, Card, Icon, Divider } from "semantic-ui-react";
import PostComments from "./postComments";
import CommentInputField from "./commentInputField";
import calculateTime from "../../utils/calculateTime";
import { deletePost, likePost } from "@/utils/postRequest";
import LikesList from "./likesList";
import Link from "next/link";

const NoImageModal = ({
  post,
  user,
  setLikes,
  likes,
  isLiked,
  comments,
  setComments,
}) => {
  return (
    <Card fluid>
      <Card.Content>
        <Image floated="left" avatar src={post.user.profilePicUrl} />
        <Card.Header>
          <Link href={`/${post.user.username}`}>{post.user.name}</Link>
        </Card.Header>
        <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>
        {post.location && <Card.Meta content={post.location} />}
        <Card.Description
          style={{
            fontSize: "18px",
            wordSpacing: "0.35px",
            letterSpacing: "0.1px",
          }}
        >
          {post.text}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon
          name={isLiked ? "heart" : "heart outline"}
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() =>
            likePost(post._id, user._id, setLikes, isLiked ? false : true)
          }
        />
        <LikesList
          postId={post._id}
          trigger={
            likes.length > 0 && (
              <span className="spanLikesList">
                {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
              </span>
            )
          }
        />
        <Divider hidden />
        <div
          style={{
            overflow: "auto",
            height: comments.length > 2 ? "200px" : "100px",
            marginBottom: "8px",
          }}
        >
          {comments.length > 0 &&
            comments.map((el, index) => (
              <PostComments
                key={el._id}
                comment={el}
                postId={post._id}
                user={user}
                setComments={setComments}
              />
            ))}
        </div>
        <CommentInputField
          postId={post._id}
          user={user}
          setComments={setComments}
        />
      </Card.Content>
    </Card>
  );
};

export default NoImageModal;
