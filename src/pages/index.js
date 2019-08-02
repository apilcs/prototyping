import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import styled from "styled-components";
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

const Padded = styled.div`
  padding: 20px 10px;
`;

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Padded>{Parser(data.markdownRemark.html)}</Padded>
  </Layout>
);

IndexPage.propTypes = {
  data: PropTypes.shape({ markdownRemark: PropTypes.object.isRequired }).isRequired
};

export default IndexPage;
