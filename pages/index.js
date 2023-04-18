import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import CreatePost from "@/components/post/createPost";
import CardPost from "@/components/post/cardPost";
import NoData from "@/components/layout/noData";
import { PostDeleteToaster } from "@/components/layout/toaster";
import InfiniteScroll from "react-infinite-scroll-component";
import { PlaceHolderPosts, EndMessage } from "@/components/post/placeholders";
import Cookies from "js-cookie";

export default function Home({
  user,
  userFollowStats,
  postData,
  errorLoading,
}) {
  const [post, setPost] = useState(postData);
  const [showToaster, setShowToaster] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  const fetchDataAtPageEnd = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: Cookies.get("token") },
        params: { pageNumber },
      });

      if (res.data.length === 0) setHasMore(false);

      setPost((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (err) {
      alert("Error fetching post");
    }
  };

  return (
    <>
      {showToaster && <PostDeleteToaster />}
      <Segment>
        <CreatePost user={user} setPost={setPost} />
        {post.length === 0 || errorLoading ? (
          <NoData />
        ) : (
          <InfiniteScroll
            hasMore={hasMore}
            next={fetchDataAtPageEnd}
            loader={<PlaceHolderPosts />}
            endMessage={<EndMessage />}
            dataLength={post.length}
          >
            {post.map((el) => (
              <CardPost
                key={el._id}
                post={el}
                user={user}
                setPost={setPost}
                setShowToaster={setShowToaster}
              />
            ))}
          </InfiniteScroll>
        )}
      </Segment>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const result = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });
    return {
      props: { postData: result.data },
    };
  } catch (error) {
    return {
      props: { errorLoading: true },
    };
  }
};
