import { useState } from "react";
import { Form } from "semantic-ui-react";
import { postComment } from "@/utils/postRequest";
const CommentInputField = ({ user, postId, setComments }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await postComment(postId, user, text, setComments, setText);
    setLoading(false);
  };

  return (
    <Form reply onSubmit={handleSubmit}>
      <Form.Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add comment"
        action={{
          color: "blue",
          icon: "edit",
          loading,
          disabled: text === "" || loading,
        }}
      />
    </Form>
  );
};

export default CommentInputField;
