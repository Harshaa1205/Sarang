import { useEffect, useState } from "react";
import { List, Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "../../utils/baseUrl";
import ProfilePic from "../common/avatar";

let cancel;

const SearchComponent = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (text.length <= 1 && loading) setLoading(false);
  }, [text]);

  const handleChange = async (e) => {
    const { value } = e.target;

    if (value.trim().length === 0) return setText("");
    if (value.length <= 1) return setText(value);

    setText(value);
    setLoading(true);
    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      // if (value.length >= 3) {
      const res = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (res.data.length === 0) {
        setResults([]);
        return setLoading(false);
      }

      setResults(res.data);
      // }
    } catch (err) {
      console.log("Error searching");
    }
    setLoading(false);
  };

  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      resultRenderer={resultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={2}
      onResultSelect={(e, data) => {
        const { username } = data.result;
        Router.push(`/${username}`);
        console.log(data.result.username);
      }}
    />
  );
};

export default SearchComponent;

const resultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List>
      <List.Item
        className="relative flex items-center"
        style={{ marginBottom: "5px", marginTop: "5px" }}
      >
        <List.Content header={name} />

        <ProfilePic
          styles={{ position: "absolute", right: "10px" }}
          src={profilePicUrl}
          alt={name}
        />
      </List.Item>
    </List>
  );
};
