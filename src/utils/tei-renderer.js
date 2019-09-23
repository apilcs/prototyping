import React from "react";
import Parser, { domToReact } from "html-react-parser";

import SectionDivider from "../ui-components/section-divider";
import Tooltip from "../ui-components/tooltip";
import { footnoteTipStyles } from "../ui-components/article-elements";

class TeiRenderer {
  constructor(teiDoc) {
    this.teiDoc = teiDoc;

    this.parserOptions = {
      /* domNode = {
          type: 'tag',
          name: 'br',
          attribs: {},
          children: [],
          next: null,
          prev: null,
          parent: null } */

      replace: domNode => {
        if (domNode.name === "section")
          return (
            <>
              {/* eslint-disable-next-line no-use-before-define */}
              <section>{this.domToReactWithReplace(domNode.children)}</section>
              <SectionDivider color={({ theme }) => theme.colors.main} />
            </>
          );

        if (domNode.name === "img")
          return (
            <img
              src={
                this.teiDoc.images.find(img =>
                  // ! hack, because when proofing the images haven't been processed by Gatsby / Sharp / whatever
                  (img.relativePath || img).endsWith(domNode.attribs.src)
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
                {this.domToReactWithReplace(domNode.children)}
              </a>
            </Tooltip>
          );
        }

        if (domNode.name === "td" && domNode.parent.children.length === 1) {
          // eslint-disable-next-line no-param-reassign
          domNode.attribs.colspan = "100%";
        }

        if (domNode.name === "span" && domNode.attribs.class.match(/\bne\b/)) {
          return (
            <Tooltip tipContent={domNode.attribs[`data-role`]}>
              <span className={domNode.attribs.class}>
                {/* eslint-disable-next-line no-use-before-define */}
                {this.domToReactWithReplace(domNode.children)}
              </span>
            </Tooltip>
          );
        }

        return false;
      }
    };

    this.footnotesParserOptions = {
      replace: domNode => {
        if (domNode.name === "li") {
          const content = this.domToReactWithReplace(domNode.children);
          if (
            typeof content === "object" &&
            typeof content[content.length - 1] === "object"
          ) {
            return (
              <li id={domNode.attribs.id}>
                {content}
                <p>
                  {content.pop().props.children}
                  <a href={`#${domNode.attribs.id}:ref`}>↩</a>
                </p>
              </li>
            );
          }
          return (
            <li id={domNode.attribs.id}>
              {content}
              <a href={`#${domNode.attribs.id}:ref`}>↩</a>
            </li>
          );
        }
        return false;
      }
    };
  }

  domToReactWithReplace = children => domToReact(children, this.parserOptions);

  title() {
    return Parser(this.teiDoc.titleHtml, this.parserOptions);
  }

  abstract() {
    return Parser(this.teiDoc.abstractHtml);
  }

  articleBody() {
    return Parser(this.teiDoc.articleBodyHtml, this.parserOptions);
  }

  footnotes() {
    return Parser(this.teiDoc.footnotesHtml, this.footnotesParserOptions);
  }
}

export default TeiRenderer;
