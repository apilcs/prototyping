import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Parser from "html-react-parser";
import { injectIntl } from "gatsby-plugin-intl"; // Link, FormattedMessage
import { intlShape } from "react-intl";

import Layout from "../components/layout";
import Meta from "../components/meta";

export const query = graphql`
  query($slug: String!) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          fields {
            slug
            lang
          }
          frontmatter {
            title
          }
          html
        }
      }
    }
  }
`;

const StaticPage = ({ data, intl }) => {
  const { edges } = data.allMarkdownRemark;
  const { locale } = intl;
  const availableNodes = edges.map(({ node: { fields } }) => fields.lang);
  let node;

  if (availableNodes.includes(locale)) {
    // get the node with the appropriate fields.lang
    [{ node }] = edges.filter(({ node: { fields } }) => fields.lang === locale);
  } else {
    // if the desired lanuage isn't available, just get the first node
    [{ node }] = edges;
  }

  return (
    <Layout>
      <Meta title={node.frontmatter.title} />
      {Parser(node.html)}
    </Layout>
  );
};

StaticPage.propTypes = {
  data: PropTypes.shape({ allMarkdownRemark: PropTypes.object.isRequired })
    .isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(StaticPage);
