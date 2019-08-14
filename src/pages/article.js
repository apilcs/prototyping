import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { injectIntl } from "gatsby-plugin-intl"; // Link, FormattedMessage
import Parser, { domToReact } from "html-react-parser";
// import { intlShape } from "react-intl";
import styled from "styled-components";

import Layout from "../components/layout";
import Meta from "../components/meta";

import SectionDivider from "../ui-components/section-divider";

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
    }
  }
`;

const Abstract = styled.blockquote`
  font-size: 0.9rem;
  font-family: ${props => props.theme.fonts.header};
  margin: 0 3.45rem 0 2rem;

  em,
  span.zh {
    font-style: normal;
  }
`;

const ArticleBody = styled.div`
  font-size: 0.9rem;

  section > header:first-child {
    font-family: ${props => props.theme.fonts.header};
    font-size: 1.4rem;
    margin: 1rem 0;
  }
`;

const Footnotes = styled.div`
  font-size: 0.9rem;
  margin-top: 4rem;
  padding-top: 1rem;
  border-top: 1px solid #000;

  li:target {
    background-color: ${props => props.theme.colors.highlight};
    border: 8px solid ${props => props.theme.colors.highlight};
  }
`;

const StaticPage = ({ data }) => {
  const { tei } = data;
  const { title, author } = tei.frontmatter;

  return (
    <Layout>
      <Meta title={title} />
      <h1>{Parser(tei.titleHtml)}</h1>
      <h3>{author}</h3>
      <Abstract>{Parser(tei.abstractHtml)}</Abstract>
      <ArticleBody>
        {Parser(tei.articleBodyHtml, {
          replace: domNode => {
            if (domNode.name === "section")
              return (
                <>
                  <section>{domToReact(domNode.children)}</section>
                  <SectionDivider />
                </>
              );
          }
        })}
      </ArticleBody>
      <Footnotes>{Parser(tei.footnotesHtml)}</Footnotes>
    </Layout>
  );
};

StaticPage.propTypes = {
  data: PropTypes.shape({ tei: PropTypes.object.isRequired }).isRequired
};

export default injectIntl(StaticPage);
