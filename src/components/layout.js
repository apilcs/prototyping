import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import styled, { ThemeProvider } from "styled-components";
import { injectIntl, Link } from "gatsby-plugin-intl";
import { intlShape } from "react-intl";

import ApilsTheme from "../theme/apils-theme";
import GlobalStyle from "../theme/global-style";

import ApilsLogo from "../images/apilcs_trsp_202x202.png";
import bgImage from "../images/simple-horizontal-light.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
    min-height: 100%;

  main {
    ${props => props.theme.pageShadow}
    background: ${props => props.theme.colors.pageBg};
    background-image: url(${bgImage});
    border-radius: 0 0 8px 0;
    flex-grow: 1;
    margin: ${props => `-${props.theme.contentOverhang}`} auto 0;
    max-width: ${props => props.theme.contentMaxWidth};
    padding: 60px 120px 20px;
    width: 100%;
  }
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.7);
  border-bottom: 1px solid ${props => props.theme.colors.main};
  display: flex;
  padding-bottom: ${props => props.theme.contentOverhang};

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
  align-items: flex-end;

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
    height: 100px;
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
  background: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.colors.mainAlt};
  padding-top: ${props => props.theme.contentOverhang};
  margin-top: -${props => props.theme.contentOverhang};

  > div {
    margin: 0 auto;
    max-width: ${props => props.theme.contentMaxWidth};
    line-height: 50px;
    text-align: right;
  }
`;

const Layout = ({ children, intl }) => {
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
                      <Link to="/">{intl.formatMessage({ id: "title" })}</Link>
                    </h1>
                    <h2>{intl.formatMessage({ id: "subtitle" })}</h2>
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
            <Footer>
              <div>© {new Date().getFullYear()}, APILS</div>
            </Footer>
          </Container>
        </>
      </ThemeProvider>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(Layout);
