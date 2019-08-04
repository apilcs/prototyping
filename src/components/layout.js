/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link, useStaticQuery, graphql } from "gatsby";
import styled, { ThemeProvider } from "styled-components";

import ApilsTheme from "../theme/apils-theme";
import GlobalStyle from "../theme/global-style";

import ApilsLogo from "../images/apilcs_trsp_202x202.png";
import bgImage from "../images/simple-horizontal-light.png";

const Container = styled.div`
  background: ${props => props.theme.pageBg};
  background-image: url(${bgImage});
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1024px;
  padding: 10px;
  position: relative;

  ${props => props.theme.pageShadow}

  main {
    flex-grow: 1;
  }
`;

const Header = styled.header`
  border-bottom: 1px solid ${props => props.theme.main};
  display: flex;
  flex-direction: row-reverse;

  > div {
    flex-grow: 1;
  }

  h1 {
    margin-bottom: 0;
  }

  h2 {
    font-size: 1.2rem;
    margin-top: 0.375rem;
  }

  img {
    height: 120px;
    margin: 5px 20px 5px 0;
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  padding-right: 1%;
`;

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin />
      </Helmet>
      <ThemeProvider theme={ApilsTheme}>
        <>
          <GlobalStyle />
          <Container>
            <Header>
              <div>
                <h1>
                  <Link to="/">{data.site.siteMetadata.title}</Link>
                </h1>
                <h2>亞太島嶼與沿海研究期刊</h2>
              </div>
              <img src={ApilsLogo} alt="APILS Logo" />
            </Header>
            <main>{children}</main>
            <Footer>© {new Date().getFullYear()}, APILS</Footer>
          </Container>
        </>
      </ThemeProvider>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
