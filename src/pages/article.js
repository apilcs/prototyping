import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
// import { Img } from "gatsby-image";
import { injectIntl } from "gatsby-plugin-intl"; // Link, FormattedMessage
// import { intlShape } from "react-intl";

import Layout from "../components/layout";
import Meta from "../components/meta";

import {
  Abstract,
  ArticleBody,
  Footnotes
} from "../ui-components/article-elements";

import TeiRenderer from "../utils/tei-renderer";

export const query = graphql`
  query {
    tei {
      frontmatter {
        author
        title
      }
      titleHtml
      abstractHtml
      articleBodyHtml
      footnotesHtml
      images {
        publicURL
        relativePath
      }
    }
  }
`;

// childImageSharp {
//   fluid(maxWidth: 400, maxHeight: 250) {
//     ...GatsbyImageSharpFluid
//   }
// }

// Can't get this to work with the gatsby-image `<Img>` component
//  (hence the commenting out here and below)
// Same problem here:
//  https://stackoverflow.com/questions/57381690/gatsby-image-mystery
// Try disabling HMR to see if that helps debug -- possibly related:
//  https://github.com/gatsbyjs/gatsby/issues/16481

const ArticlePage = ({ data }) => {
  const { tei } = data;
  const { title, author } = tei.frontmatter;
  const teiRenderer = new TeiRenderer(tei);

  return (
    <Layout>
      <Meta title={title} />
      <h1>{teiRenderer.title()}</h1>
      <h3>{author}</h3>
      <Abstract>{teiRenderer.abstract()}</Abstract>
      <ArticleBody>{teiRenderer.articleBody()}</ArticleBody>
      <Footnotes>{teiRenderer.footnotes()}</Footnotes>
    </Layout>
  );
};

ArticlePage.propTypes = {
  data: PropTypes.shape({ tei: PropTypes.object.isRequired }).isRequired
};

export default injectIntl(ArticlePage);
