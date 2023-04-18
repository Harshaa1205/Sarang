import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import {
  HeaderMessage,
  FooterMessage,
} from "@/components/common/welcomeMessage";
import {
  Form,
  Button,
  Message,
  Segment,
  TextArea,
  Divider,
} from "semantic-ui-react";
import { registerUser } from "@/utils/authUser";
import uploadPic from "@/utils/uploadPicToCloudinary";
import CommonInputs from "@/components/common/commonInputs";
import ImageDropDiv from "@/components/common/imageDropDiv";
const regexUserName = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
let cancel;

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
  });
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [formLoading, setFormLoading] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const inputRef = useRef();

  const { name, email, password, bio } = user;

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [name, email, password, bio]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();

      const CancelToken = axios.CancelToken;

      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (errorMessage !== null) setErrorMessage(null);

      if (res.data === "Available") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      } else {
        setUsernameAvailable(false);
        setErrorMessage("Username not available");
      }
    } catch (err) {
      setUsernameAvailable(false);
      setErrorMessage("Username not available");
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicUrl;

    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMessage("Image upload failed!");
    }

    await registerUser(user, profilePicUrl, setErrorMessage, setFormLoading);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMessage !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Oops!"
          content={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            inputRef={inputRef}
            handleChange={handleChange}
            setMedia={setMedia}
          />
          <Form.Input
            label="Name"
            placeholder="name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            required
          />
          <Form.Input
            label="Email"
            placeholder="email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            required
          />
          <Form.Input
            label="Password"
            placeholder="password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />
          <Form.Input
            loading={usernameLoading}
            error={!usernameAvailable}
            label="username"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (regexUserName.test(e.target.value))
                setUsernameAvailable(true);
              else setUsernameAvailable(false);
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
            required
          />
          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />
          <Divider />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
};

export default Signup;
