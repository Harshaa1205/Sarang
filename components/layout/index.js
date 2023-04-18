import React, { useEffect, createRef } from "react";
import {
  Container,
  Sticky,
  Visibility,
  Grid,
  Ref,
  Divider,
  Segment,
} from "semantic-ui-react";
import Navbar from "./navbar";
import HeadTags from "./headTags";
import nProgress from "nprogress";
import { useRouter } from "next/router";
import Search from "./search";
import SideMenu from "./sideMenu";

const Layout = ({ children, user }) => {
  const contextRef = createRef();

  return (
    <>
      {/* <HeadTags /> */}
      {user ? (
        <div
          style={{
            marginLeft: "1rem",
            marginRight: "2rem",
          }}
        >
          <Grid>
            <Grid.Column
              only="tablet computer"
              className="menuCol"
              floated="left"
              tablet={1}
              computer={2}
            >
              <SideMenu user={user} />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={15} computer={12}>
              {children}
            </Grid.Column>
            <Grid.Column
              className="menuCol searchCol"
              computer={2}
              only="computer"
            >
              <div className="stickyCol">
                <Search />
              </div>
            </Grid.Column>
          </Grid>
        </div>
      ) : (
        <>
          <Navbar />
          <Container style={{ paddingTop: "1rem" }} text>
            {children}
          </Container>
        </>
      )}
    </>
  );
};

export default Layout;
