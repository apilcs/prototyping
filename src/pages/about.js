import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import styled from "styled-components";
import Parser from "html-react-parser";

import Layout from "../components/layout";
import SEO from "../components/seo";

export const query = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/.*/content/about.md/" }) {
      html
    }
  }
`;

const Padded = styled.div`
  padding: 20px 10px;
`;

const AboutPage = ({ data }) => (
  <Layout>
    <SEO title="About APILS" />
    <Padded>{Parser(data.markdownRemark.html)}</Padded>
  </Layout>
);

AboutPage.propTypes = {
  data: PropTypes.shape({ markdownRemark: PropTypes.object.isRequired }).isRequired
};

export default AboutPage;
