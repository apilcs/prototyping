import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
// import { Img } from "gatsby-image";
import { injectIntl } from "gatsby-plugin-intl"; // Link, FormattedMessage
import Parser, { domToReact } from "html-react-parser";
// import { intlShape } from "react-intl";
import styled, { css } from "styled-components";
import { lighten, transparentize } from "polished";

import Layout from "../components/layout";
import Meta from "../components/meta";

import SectionDivider from "../ui-components/section-divider";
import Tooltip from "../ui-components/tooltip";

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

const footnoteTipStyles = css`
  ${({ theme }) => theme.scale(-0.3)};
  background: ${({ theme }) => transparentize(0.05, theme.colors.main)};
  border-color: ${({ theme }) => transparentize(0.05, theme.colors.main)};
  font-family: ${({ theme }) => theme.fonts.body};
  font-style: normal;
  max-width: 20rem;
  padding: 0.5rem 1rem;
  z-index: 2;

  a[href^="#ftn"] {
    display: none;
  }

  p {
    margin-bottom: ${({ theme }) => theme.rhythm(1 / 2)};
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const Abstract = styled.blockquote`
  ${({ theme }) => theme.scale(-0.1)}
  font-family: ${({ theme }) => theme.fonts.header};
  margin: ${({ theme: { rhythm } }) =>
    `${rhythm(1)} ${rhythm(2)} ${rhythm(1)} ${rhythm(1)}`};
  text-align: justify;

  em,
  span.zh {
    font-style: normal;
  }
`;

const ArticleBody = styled.div`
  ${({ theme }) => theme.scale(0)};

  section > header:first-child {
    ${({ theme }) => theme.scale(0.5)};
    font-family: ${({ theme }) => theme.fonts.header};
    margin: ${({ theme }) => theme.rhythm(2 / 3)} 0;
  }

  figure {
    border: 1px solid ${({ theme }) => theme.colors.bodyText};
    border-radius: 5px;
    display: inline-block;
    margin: 0 0.5%;
    max-width: 48%;
    padding: ${({ theme }) => theme.rhythm(1 / 5)};

    img {
      margin-bottom: 0;
    }

    figcaption {
      background: ${({ theme }) => lighten(0.4, theme.colors.main)};
      font-family: ${({ theme }) => theme.fonts.header};
      ${({ theme }) => theme.scale(-0.2)};
      padding: ${({ theme }) => theme.rhythm(1 / 5)};
    }
  }

  table {
    ${({ theme }) => theme.scale(-0.1)};
    font-family: ${({ theme }) => theme.fonts.header};

    tr:nth-child(odd) {
      background: #eaeaea;
    }

    tr:first-child {
      background: ${({ theme }) => lighten(0.4, theme.colors.main)};
      font-weight: bold;
    }

    td {
      padding: ${({ theme: { rhythm } }) =>
        `${rhythm(1 / 6)} ${rhythm(1 / 3)}`};

      &[colspan="100%"] {
        text-align: center;
      }
    }
  }

  blockquote {
    border: none;
    margin: ${({ theme: { rhythm } }) => `0 ${rhythm(1)} ${rhythm(1)}`};
    padding: 0;

    span.zh {
      font-style: normal;
    }
  }
`;

const Footnotes = styled.div`
  ${({ theme }) => theme.scale(-0.2)};
  border-top: 1px solid #000;
  color: rgba(0, 0, 0, 0.6);
  margin-top: ${({ theme }) => theme.rhythm(2)};
  padding-top: ${({ theme }) => theme.rhythm(2 / 3)};

  li:target {
    background-color: ${({ theme }) => theme.colors.highlight};
    border: 8px solid ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.bodyText};
  }
`;

// domNode = { type: 'tag',
//   name: 'br',
//   attribs: {},
//   children: [],
//   next: null,
//   prev: null,
//   parent: null }

const ArticlePage = ({ data }) => {
  const { tei } = data;
  const { title, author } = tei.frontmatter;

  const parserOptions = {
    replace: domNode => {
      if (domNode.name === "section")
        return (
          <>
            {/* eslint-disable-next-line no-use-before-define */}
            <section>{domToReactWithReplace(domNode.children)}</section>
            <SectionDivider color={({ theme }) => theme.colors.main} />
          </>
        );

      if (domNode.name === "img")
        return (
          <img
            src={
              tei.images.find(img =>
                img.relativePath.endsWith(domNode.attribs.src)
              ).publicURL
            }
            alt=""
          />
          // <Img
          //   fluid={
          //     tei.images.find(img =>
          //       img.relativePath.endsWith(domNode.attribs.src)
          //     ).childImageSharp.fluid
          //   }
          //   alt=""
          // />
        );

      if (domNode.name === "a" && /#ftn\d+/.test(domNode.attribs.href)) {
        return (
          <Tooltip
            tipContent={() =>
              Parser(document.querySelector(domNode.attribs.href).innerHTML)
            }
            tipStyles={footnoteTipStyles}>
            <a href={domNode.attribs.href}>
              {/* eslint-disable-next-line no-use-before-define */}
              {domToReactWithReplace(domNode.children)}
            </a>
          </Tooltip>
        );
      }

      if (domNode.name === "td" && domNode.parent.children.length === 1) {
        // eslint-disable-next-line no-param-reassign
        domNode.attribs.colspan = "100%";
      }

      return false;
    }
  };

  const domToReactWithReplace = children => domToReact(children, parserOptions);

  return (
    <Layout>
      <Meta title={title} />
      <h1>{Parser(tei.titleHtml, parserOptions)}</h1>
      <h3>{author}</h3>
      <Abstract>{Parser(tei.abstractHtml)}</Abstract>
      <ArticleBody>{Parser(tei.articleBodyHtml, parserOptions)}</ArticleBody>
      <Footnotes>{Parser(tei.footnotesHtml)}</Footnotes>
    </Layout>
  );
};

ArticlePage.propTypes = {
  data: PropTypes.shape({ tei: PropTypes.object.isRequired }).isRequired
};

export default injectIntl(ArticlePage);
