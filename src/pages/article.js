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
  background: ${props => transparentize(0.05, props.theme.colors.main)};
  border-color: ${props => transparentize(0.05, props.theme.colors.main)};
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.9rem;
  line-height: 1.45;
  max-width: 20rem;
  padding: 0.5rem 1rem;
  z-index: 2;

  a[href^="#ftn"] {
    display: none;
  }

  p:last-of-type {
    margin-bottom: 0;
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

  figure {
    border: 1px solid ${props => props.theme.colors.bodyText};
    border-radius: 5px;
    display: inline-block;
    margin: 0 0.5%;
    max-width: 48%;
    padding: 5px;

    img {
      margin-bottom: 0;
    }

    figcaption {
      background: ${props => lighten(0.4, props.theme.colors.main)};
      font-family: ${props => props.theme.fonts.header};
      font-size: 0.8rem;
      padding: 5px;
    }
  }

  table {
    font-family: ${props => props.theme.fonts.header};
    font-size: 0.8rem;

    tr:nth-child(odd) {
      background: #eaeaea;
    }

    tr:first-child {
      background: ${props => lighten(0.4, props.theme.colors.main)};
      font-weight: bold;
    }

    td {
      padding: 0.25rem 0.5rem;

      &[colspan="100%"] {
        text-align: center;
      }
    }
  }

  blockquote {
    border: none;
    margin: 0 1.45rem 1.45rem;
    padding: 0;

    span.zh {
      font-style: normal;
    }
  }
`;

const Footnotes = styled.div`
  border-top: 1px solid #000;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  margin-top: 4rem;
  padding-top: 1rem;

  li:target {
    background-color: ${props => props.theme.colors.highlight};
    border: 8px solid ${props => props.theme.colors.highlight};
    color: ${props => props.theme.colors.bodyText};
  }
`;

// domNode = { type: 'tag',
//   name: 'br',
//   attribs: {},
//   children: [],
//   next: null,
//   prev: null,
//   parent: null }

const StaticPage = ({ data }) => {
  const { tei } = data;
  const { title, author } = tei.frontmatter;

  const parserOptions = {
    replace: domNode => {
      if (domNode.name === "section")
        return (
          <>
            {/* eslint-disable-next-line no-use-before-define */}
            <section>{domToReactWithReplace(domNode.children)}</section>
            <SectionDivider color={props => props.theme.colors.main} />
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

StaticPage.propTypes = {
  data: PropTypes.shape({ tei: PropTypes.object.isRequired }).isRequired,
  theme: PropTypes.objectOf({}).isRequired
};

export default injectIntl(StaticPage);
