import { useState } from "react";
import { Comment, Divider, Icon } from "semantic-ui-react";
import calculateTime from "@/utils/calculateTime";
import { deleteComment } from "@/utils/postRequest";

const PostComments = ({ comment, postId, user, setComments }) => {
  const [disabled, setDisabled] = useState(false);
  const handleDeleteComment = () => {
    setDisabled(true);
    deleteComment(postId, comment._id, setComments, setDisabled);
  }
  return (
    <div style={{ marginBottom: "10px" }}>
      <Comment.Group>
        <Comment
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Comment.Avatar
              src={comment.user.profilePicUrl}
              style={{ marginRight: "1rem" }}
            />
            <Comment.Content>
              <Comment.Author as="a" href={`/${comment.user.username}`}>
                {comment.user.name}
              </Comment.Author>
              <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>
              <Comment.Text>{comment.text}</Comment.Text>
            </Comment.Content>
          </div>
          <div>
            <Comment.Actions>
              <Comment.Action>
                {(user.role === "root" || comment.user._id === user._id) && (
                  <Icon
                    disabled={disabled}
                    color="red"
                    name="trash"
                    size="large"
                    onClick={handleDeleteComment}
                  />
                )}
              </Comment.Action>
            </Comment.Actions>
          </div>
        </Comment>
      </Comment.Group>
    </div>
  );
};

export default PostComments;
