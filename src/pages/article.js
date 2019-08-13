import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { injectIntl } from "gatsby-plugin-intl"; // Link, FormattedMessage
import Parser from "html-react-parser";
// import { intlShape } from "react-intl";
import styled from "styled-components";

import Layout from "../components/layout";
import Meta from "../components/meta";

export const query = graphql`
  query {
    tei {
      frontmatter {
        author
        title
      }
      abstractHtml
    }
  }
`;

const Abstract = styled.blockquote`
  font-size: 0.9em;
  font-family: ${props => props.theme.fonts.header};
  margin: 0 3.45rem 0 2rem;

  em,
  span.zh {
    font-style: normal;
  }
`;

const StaticPage = ({ data }) => {
  const { tei } = data;
  const { title, author } = tei.frontmatter;

  return (
    <Layout>
      <Meta title={title} />
      <h1>{title}</h1>
      <h3>{author}</h3>
      <Abstract>{Parser(tei.abstractHtml)}</Abstract>
    </Layout>
  );
};

StaticPage.propTypes = {
  data: PropTypes.shape({ tei: PropTypes.object.isRequired }).isRequired
};

export default injectIntl(StaticPage);
