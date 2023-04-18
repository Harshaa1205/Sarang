import { useState, useRef } from "react";
import { Form, Button, Image, Divider, Message, Icon } from "semantic-ui-react";
import uploadPic from "@/utils/uploadPicToCloudinary";
import { submitNewPost } from "@/utils/postRequest";

const CreatePost = ({ user, setPost }) => {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [error, setError] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Upload failed");
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPost,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />
        <Form.Group>
          <Image src={user.profilePicUrl} circular inline avatar />
          <Form.TextArea
            placeholder="Whats happening?"
            name="text"
            label="Add Text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>
        <Form.Group
          style={{
            marginLeft: "2rem",
          }}
        >
          <Form.Input
            placeholder="Want to add location?"
            name="location"
            label="Add location"
            value={newPost.location}
            onChange={handleChange}
            icon="map marker alternate"
          />
          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>

        <div
          style={{
            textAlign: "center",
            height: "150px",
            width: "150px",
            border: "dotted",
            paddingTop: media === null && "60px",
            cursor: "pointer",
            borderColor: highlight ? "green" : "black",
            marginLeft: "2.5rem",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setHighlight(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlight(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlight(true);
            const file = Array.from(e.dataTransfer.files);
            setMedia(file[0]);
            setMediaPreview(URL.createObjectURL(file[0]));
          }}
          onClick={() => inputRef.current.click()}
        >
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <>
              <Image
                src={mediaPreview}
                size="medium"
                alt="PostImage"
                centered
                style={{ width: "200px", height: "150px" }}
              />
            </>
          )}
        </div>
        <Divider hidden />
        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          icon="send"
          loading={loading}
          style={{
            backgroundColor: "#1DA1F2",
            color: "#FFFF",
            marginLeft: "2.5rem",
          }}
        />
      </Form>
      <Divider />
    </>
  );
};

export default CreatePost;
