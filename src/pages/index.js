import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Parser from "html-react-parser";

import Layout from "../components/layout";
import SEO from "../components/seo";

export const query = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/.*/content/front-page.md/" }) {
      html
    }
  }
`;

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    {Parser(data.markdownRemark.html)}
  </Layout>
);

IndexPage.propTypes = {
  data: PropTypes.shape({ markdownRemark: PropTypes.object.isRequired }).isRequired
};

export default IndexPage;
