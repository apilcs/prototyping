import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import styled, { ThemeProvider } from "styled-components";
import { injectIntl, Link } from "gatsby-plugin-intl";
import { intlShape } from "react-intl";

import ApilsTheme from "../theme/apils-theme";
import GlobalStyle from "../theme/global-style";

import LanguageSwitcher from "./language-switcher";

import ApilsLogo from "../images/apils_logo.min.svg";
import bgImage from "../images/simple-horizontal-light.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;

  main {
    ${({ theme }) => theme.pageShadow}
    background: ${({ theme }) => theme.colors.pageBg};
    background-image: url(${bgImage});
    border-radius: 0 0 8px 0;
    flex-grow: 1;
    margin: ${props => `-${props.theme.contentOverhang}`} auto 0;
    max-width: ${({ theme }) => theme.contentMaxWidth};
    padding: ${({ theme: { rhythm } }) =>
      `${rhythm(2)} ${rhythm(4)} ${rhythm(2 / 3)}`};
    width: 100%;
  }
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid ${({ theme }) => theme.colors.main};
  display: flex;
  padding-bottom: ${({ theme }) => theme.contentOverhang};

  > div {
    flex-grow: 1;
    margin: 0 auto;
    max-width: ${({ theme }) => theme.contentMaxWidth};
    position: relative;
  }
`;

const Branding = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: ${({ theme }) => theme.rhythm(1 / 3)};
  align-items: center;

  > div {
    flex-grow: 1;
  }

  h1 {
    margin-bottom: 0;
  }

  h2 {
    ${({ theme }) => theme.scale(0.5)};
    color: ${({ theme }) => theme.colors.mainAlt};
    margin-bottom: ${({ theme }) => theme.rhythm(1 / 8)};
    margin-top: 0;
  }

  svg {
    fill: ${({ theme }) => theme.colors.main};
    margin: 5px 20px 5px 0;
    width: 100px;
  }
`;

const Naivgation = styled.nav`
  background: ${({ theme }) => theme.colors.main};
  border-radius: 0 8px 0 0;
  color: ${({ theme }) => theme.colors.mainAlt};
  font-family: ${({ theme }) => theme.fonts.header};

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
      color: ${({ theme }) => theme.colors.mainAlt};
      display: inline-block;
      padding: ${({ theme: { rhythm } }) =>
        `${rhythm(1 / 8)} ${rhythm(1 / 3)}`};
      transition: background-color 0.25s ease;

      &:hover,
      &.active {
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: none;
      }
    }
  }
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.mainAlt};
  padding-top: ${({ theme }) => theme.contentOverhang};
  margin-top: -${({ theme }) => theme.contentOverhang};

  > div {
    margin: 0 auto;
    max-width: ${({ theme }) => theme.contentMaxWidth};
    line-height: 50px;
    text-align: right;
  }
`;

const Layout = ({ children, intl }) => {
  return (
    <>
      <Helmet>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin
        />
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
                  <ApilsLogo />
                </Branding>
                <Naivgation>
                  <ul>
                    <li>
                      <Link to="/" activeClassName="active">
                        {intl.formatMessage({ id: "nav.home" })}
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/" activeClassName="active">
                        {intl.formatMessage({ id: "nav.about" })}
                      </Link>
                    </li>
                    <li>
                      <Link to="/volumes/" activeClassName="active">
                        {intl.formatMessage({ id: "nav.volumes" })}
                      </Link>
                    </li>
                    <li>
                      <Link to="/submissions/" activeClassName="active">
                        {intl.formatMessage({ id: "nav.submissions" })}
                      </Link>
                    </li>
                    <li>
                      <Link to="/article/" activeClassName="active">
                        {intl.formatMessage({ id: "nav.article" })}
                      </Link>
                    </li>
                  </ul>
                </Naivgation>
                <LanguageSwitcher />
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
