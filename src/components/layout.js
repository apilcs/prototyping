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
  display: flex;
  flex-direction: column;

  main {
    ${props => props.theme.pageShadow}
    background-image: url(${bgImage});
    background: ${props => props.theme.colors.pageBg};
    flex-grow: 1;
    margin: ${props => `-${props.theme.headerOverhang}`} auto 0;
    max-width: ${props => props.theme.contentMaxWidth};
    padding: 60px 120px 20px;
    width: 100%;
  }
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid ${props => props.theme.colors.main};
  display: flex;
  padding-bottom: ${props => props.theme.headerOverhang};

  > div {
    flex-grow: 1;
    margin: 0 auto;
    max-width: ${props => props.theme.contentMaxWidth};
  }
`;

const Branding = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;

  > div {
    flex-grow: 1;
  }

  h1 {
    margin-bottom: 0;
  }

  h2 {
    color: ${props => props.theme.colors.mainAlt};
    font-size: 1.4rem;
    margin-top: 0.375rem;
  }

  img {
    height: 120px;
    margin: 5px 20px 5px 0;
  }
`;

const Naivgation = styled.nav`
  ${props => props.theme.pageShadow}
  background: ${props => props.theme.colors.main};
  border-radius: 0 8px 0 0;
  color: ${props => props.theme.colors.mainAlt};
  font-family: ${props => props.theme.fonts.header};

  ul {
    display: flex;
    margin: 0;
  }
  li {
    border-right: 1px solid rgba(255, 255, 255, 0.07);
    display: inline-block;
    list-style: none;
    margin-bottom: 0;
    text-align: center;

    a {
      color: ${props => props.theme.colors.mainAlt};
      display: inline-block;
      padding: 4px 10px;
      transition: background-color 0.25s ease;

      &:hover, &.active {
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: none;
      }
    }
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
                <Branding>
                  <div>
                    <h1>
                      <Link to="/">{data.site.siteMetadata.title}</Link>
                    </h1>
                    <h2>亞太島嶼與沿海研究期刊</h2>
                  </div>
                  <img src={ApilsLogo} alt="APILS Logo" />
                </Branding>
                <Naivgation>
                  <ul>
                    <li>
                      <Link to="/about/" activeClassName="active">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/volumes/" activeClassName="active">
                        Volumes
                      </Link>
                    </li>
                    <li>
                      <Link to="/submissions/" activeClassName="active">
                        Submissions
                      </Link>
                    </li>
                  </ul>
                </Naivgation>
              </div>
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
