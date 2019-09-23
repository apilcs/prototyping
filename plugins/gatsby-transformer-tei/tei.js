import JsonMlDoc from "./jsonml";

class TeiDoc extends JsonMlDoc {
  constructor(xmlString, debug) {
    super(xmlString, debug);

    this.footnotes = {};
    this.skipExprs = ["titlePart", "div[@type='articleBody']"];

    this.renderToHtml = {
      hi: (children, attrs, doc, parent) => {
        if (attrs.rend && attrs.rend === "italic")
          return `<em>${doc.toHtml([null, ...children], parent)}</em>`;

        if (attrs.rend && attrs.rend === "bold")
          return `<strong>${doc.toHtml([null, ...children], parent)}</strong>`;

        if (attrs.rend && attrs.rend === "sup")
          return `<sup>${doc.toHtml([null, ...children], parent)}</sup>`;

        if (this.debug)
          // eslint-disable-next-line no-console
          console.log(
            `passing through tag: ${this.constructor.renderTag(["hi", attrs])}`
          );

        return `<span>${doc.toHtml([null, ...children], parent)}</span>`;
      },

      p: (children, attrs, doc, parent) => {
        return `<p>${doc.toHtml([null, ...children], parent)}</p>`;
      },

      note: (children, attrs /* doc, parent */) => {
        const { n: footnoteIndex, "xml:id": footnoteId } = attrs;
        return `<sup id="${footnoteId}:ref"><a href="#${footnoteId}">${footnoteIndex}</a></sup>`;
      },

      placeName: (children, attrs, doc, parent) => {
        if (this.debug && Object.keys(attrs).length)
          // eslint-disable-next-line no-console
          console.warn(
            `Unexpected attrs: ${this.constructor.renderTag([
              "placeName",
              attrs
            ])}`
          );
        return `<span class="place-name">${doc.toHtml(
          [null, ...children],
          parent
        )}</span>`;
      },

      name: (children, attrs, doc, parent) => {
        return `<span class="ne ${attrs.type}" data-role="${
          attrs.role
        }">${doc.toHtml([null, ...children], parent)}</span>`;
      },

      div: (children, attrs, doc, parent) => {
        const { type } = attrs;
        if (type === "section")
          return `<section>${doc.toHtml(
            [null, ...children],
            parent
          )}</section>`;

        if (this.debug)
          // eslint-disable-next-line no-console
          console.log(
            `passing through tag: ${this.constructor.renderTag(["div", attrs])}`
          );
        return doc.toHtml([null, ...children], parent);
      },

      head: (children, attrs, doc, parent) => {
        if (this.debug && Object.keys(attrs).length)
          // eslint-disable-next-line no-console
          console.warn(
            `Unexpected attrs: ${this.constructor.renderTag(["head", attrs])}`
          );

        return `<header>${doc.toHtml([null, ...children], parent)}</header>`;
      },

      figure: (children, attrs, doc /* parent */) => {
        const graphic = children.find(elem => elem[0] === "graphic");
        const head = children.find(elem => elem[0] === "head");
        return `\
        <figure>
          <img src="${graphic[1].url}" alt="" />
          <figcaption>${doc.toHtml(
            [null, ...head.slice(1)],
            ["figure", attrs, ...children]
          )}</figcaption>
        </figure>`;
      },

      table: (children, attrs, doc, parent) => {
        return `<table>${doc.toHtml(
          [null, ...children],
          parent
        )}</table>`.replace(/>\s+</g, "><");
      },

      row: (children, attrs, doc, parent) => {
        return `<tr>${doc.toHtml([null, ...children], parent)}</tr>`;
      },

      cell: (children, attrs, doc, parent) => {
        return `<td>${doc.toHtml([null, ...children], parent)}</td>`;
      },

      quote: (children, attrs, doc, parent) => {
        if (attrs.rend && attrs.rend === "inline") {
          return `“${doc.toHtml([null, ...children], parent)}”`;
        }
        return `<blockquote>${doc.toHtml(
          [null, ...children],
          parent
        )}</blockquote>`;
      }
    };

    // collect footnotes on class instantiation
    this.collectFootnotes();
  }

  collectFootnotes() {
    this.getElemsByName("note").forEach(_footnote => {
      const footnote = [..._footnote];
      footnote.shift();
      const attrs = footnote[0] instanceof Object ? footnote.shift() : {};
      const { n: footnoteIndex, "xml:id": footnoteId } = attrs;
      this.footnotes[footnoteId] = {
        index: footnoteIndex,
        content: this.toHtml([null, ...footnote])
      };
    });
  }

  getFrontmatter() {
    return {
      title: this.getFirstTextContent("titleStmt/title") || "",
      author: this.getFirstTextContent("titleStmt/author") || ""
    };
  }

  getTitleHtml() {
    const titleElem = this.getElemByPath("titlePart");
    return titleElem ? TeiDoc.markupChinese(this.toHtml(titleElem)) : "";
  }

  getAbstractHtml() {
    const abstractElem = this.getElemByPath("div[@type='abstract']");
    return abstractElem ? TeiDoc.markupChinese(this.toHtml(abstractElem)) : "";
  }

  // eslint-disable-next-line class-methods-use-this
  getKeywords() {
    // TODO: add this method :)
  }

  getArticleBodyHtml() {
    const bodyElem = this.getElemByPath("div[@type='articleBody']");
    return bodyElem
      ? TeiDoc.markupChinese(this.toHtml(bodyElem))
      : TeiDoc.markupChinese(this.toHtml(this.getElemByPath("body")));
  }

  getFootnotesHtml() {
    const footnotesHtml = Object.entries(this.footnotes)
      .map(([id, footnote]) => `<li id="${id}">${footnote.content}</li>`)
      .join("");
    return TeiDoc.markupChinese(`<ol>${footnotesHtml}</ol>`);
  }

  getImagePaths() {
    return this.getElemsByName("graphic").map(graphic => graphic[1].url);
  }

  static markupChinese(text) {
    const chineseUnicodeRanges = [
      "[\u4e00-\u9fff]", // CJK Unified Ideographs
      "[\u3400-\u4dbf]", // CJK Unified Ideographs Extension A
      "[\u{20000}-\u{2a6df}]", // CJK Unified Ideographs Extension B
      "[\u{2a700}-\u{2b73f}]", // CJK Unified Ideographs Extension C
      "[\u{2b740}-\u{2b81f}]", // CJK Unified Ideographs Extension D
      "[\u{2b820}-\u{2ceaf}]", // CJK Unified Ideographs Extension E
      "[\u{2ceb0}-\u{2ebef}]", // CJK Unified Ideographs Extension F
      "[\uf900-\ufaff]", // CJK Compatibility Ideographs
      "[\u3300-\u33ff]", // CJK Compatibility
      "[\ufe30-\ufe4f]", // CJK Compatibility Forms
      "[\u{2f800}-\u{2fa1f}]" // CJK Compatibility Ideographs Supplement
    ];

    const anyChineseRegex = new RegExp(
      `(?<chinese>(?:${chineseUnicodeRanges.join("|")})+)`,
      "ug"
    );
    return text.replace(anyChineseRegex, '<span class="zh">$<chinese></span>');
  }
}

export default TeiDoc;
