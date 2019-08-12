const { JsonMlDoc } = require(`./jsonml`);

class TeiDoc extends JsonMlDoc {
  constructor(xmlString) {
    super(xmlString);

    this.render = {
      hi: (elem, attrs, doc) => {
        if (attrs.rend && attrs.rend === "italic") {
          return `<em>${doc.toHtml([null, ...elem])}</em>`;
        }

        if (attrs.rend) {
          return `<span class="${attrs.rend}">${doc.toHtml([
            null,
            ...elem
          ])}</span>`;
        }

        return `<span>${doc.toHtml([null, ...elem])}</span>`;
      }
    };

    this.skipTags = [];
  }

  getFrontmatter() {
    return {
      title: this.getFirstTextContent("titleStmt/title"),
      author: this.getFirstTextContent("titleStmt/author")
    };
  }

  getAbstractHtml() {
    return this.toHtml(this.getElemByPath("div[@type='abstract']"));
  }
}

module.exports = { TeiDoc };
