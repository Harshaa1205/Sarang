import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Popup,
  Button,
  Header,
  Modal,
} from "semantic-ui-react";
import PostComments from "./postComments";
import CommentInputField from "./commentInputField";
import calculateTime from "../../utils/calculateTime";
import { deletePost, likePost } from "@/utils/postRequest";
import LikesList from "./likesList";
import NoImageModal from "./noImageModal";
import ImageModal from "./imageModal";
const CardPost = ({ post, user, setPost, setShowToaster }) => {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;
  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments,
  });
  return (
    <>
      {showModal && (
        <Modal
          open={showModal}
          closeIcon
          closeOnDimmerClick
          onClose={() => setShowModal(false)}
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
      )}
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              floated="left"
              wrapped
              ui={false}
              style={{ cursor: "pointer" }}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}
          <Card.Content>
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            {(post.user._id === user._id || user.role === "root") && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Icon
                      name="trash"
                      style={{ cursor: "pointer", float: "right" }}
                      size="large"
                      color="red"
                    />
                  }
                >
                  <Header
                    as="h4"
                    content="Are you sure you want to delete post?"
                  />
                  <p>This action is irreversible.</p>
                  <Button
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={() =>
                      deletePost(post._id, setPost, setShowToaster)
                    }
                  />
                </Popup>
              </>
            )}
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
            <div style={{ marginBottom: "10px" }}>
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
                      {`${likes.length} ${
                        likes.length === 1 ? "like" : "likes"
                      }`}
                    </span>
                  )
                }
              />
              <Icon
                name="comment outline"
                style={{ marginLeft: "7px", cursor: "pointer" }}
                color="blue"
              />
            </div>
            {comments.length > 0 &&
              comments.map(
                (el, index) =>
                  index < 3 && (
                    <PostComments
                      key={el._id}
                      comment={el}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}
            {comments.length > 3 && (
              <Button
                content="view more"
                color="teal"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            )}
            <Divider hidden />
            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </>
  );
};

export default CardPost;
