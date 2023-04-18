import "@/styles/globals.css";
import Layout from "@/components/layout";
import Head from "next/head";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "@/utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        {/* <title></title> */}
      </Head>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};
  const protectedRoutes = ctx.pathname === "/";

  if (!token) {
    protectedRoutes && redirectUser(ctx, "/login");
  } else {
    try {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });
      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, "/");

      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;
    } catch (err) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }
  return { pageProps };
};
