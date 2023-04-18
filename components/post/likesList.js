import { useState } from "react";
import axios from "axios";
import { List, Popup, Image } from "semantic-ui-react";
import baseUrl from "@/utils/baseUrl";
import catchErrors from "@/utils/catchErrors";
import Cookies from "js-cookie";
import Link from "next/link";
import { LikesPlaceHolder } from "./placeholders";

function LikesList({ postId, trigger }) {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLikesList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/posts/like/${postId}`, {
        headers: { Authorization: Cookies.get("token") },
      });
      setLikesList(res.data);
    } catch (err) {
      alert(catchErrors(err));
    }
    setLoading(false);
  };

  return (
    <>
      <Popup
        on="click"
        onClose={() => setLikesList([])}
        onOpen={getLikesList}
        popperDependencies={[likesList]}
        trigger={trigger}
        wide
      >
        {loading ? (
          <LikesPlaceHolder />
        ) : (
          <>
            {likesList.length > 0 && (
              <div
                style={{
                  overflow: "auto",
                  maxHeight: "15rem",
                  height: "15rem",
                  minWidth: "201px",
                }}
              >
                <List selection size="large">
                  {likesList.map((el) => (
                    <List.Item key={el._id}>
                      <Image avatar src={el.user.profilePicUrl} />
                      <List.Content>
                        <Link href={`/${el.user.username}`}>
                          <List.Header as="a" content={el.user.name} />
                        </Link>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
          </>
        )}
      </Popup>
    </>
  );
}

export default LikesList;
