const libxmljs = require("libxmljs");

const ns = { tei: "http://www.tei-c.org/ns/1.0" };

function parseTei(xmlString) {
  return libxmljs.parseXml(xmlString);
}

function getText(teiDoc, xpath) {
  // dealing with namespaces with libxml is a pain, and having
  // to remember to call .toString() is annoying to, so this
  // is a convenience function
  return teiDoc
    .get(`${xpath.replace(/\/(?!\/)/g, "/tei:")}/text()`, ns)
    .toString();
}

function getFrontmatter(teiDoc) {
  return {
    title: getText(teiDoc, "//titleStmt/title"),
    author: getText(teiDoc, "//titleStmt/author")
  };
}

module.exports = { parseTei, getFrontmatter };
