const libxmljs = require("libxmljs");

const ns = { tei: "http://www.tei-c.org/ns/1.0" };

function parseTei(xmlString) {
  return libxmljs.parseXml(xmlString);
}

function getTextByXpath(teiDoc, xpathExpr) {
  // dealing with namespaces with libxml is a pain, and having
  // to remember to call .toString() is annoying to, so this
  // is a convenience function
  return teiDoc
    .get(`${xpathExpr.replace(/\/(?!\/)/g, "/tei:")}/text()`, ns)
    .toString();
}

function getElemByXpath(teiDoc, xpathExpr) {
  // dealing with namespaces with libxml is a pain, and having
  // to remember to call .toString() is annoying to, so this
  // is a convenience function
  return teiDoc.get(`${xpathExpr.replace(/\/(?!\/)/g, "/tei:")}`, ns);
}

function getFrontmatter(teiDoc) {
  return {
    title: getTextByXpath(teiDoc, "//titleStmt/title"),
    author: getTextByXpath(teiDoc, "//titleStmt/author")
  };
}

function toHtml(xmlString) {
  const parser = new libxmljs.SaxParser();

  let openTag = null;
  let currentString = "";
  // parser.on('startDocument', ...);
  parser.on("startElementNS", (tag, attrs, prefix, uri, namespace) => {
    // console.log(tag, attrs);
    openTag = tag;
  });

  parser.on("characters", chars => {
    // console.log(`"${chars}"`);
    currentString += chars;
  });

  parser.on("endElementNS", (tag, prefix, uri) => {
    if (tag == openTag) {
      console.log(`${tag}: ${currentString}`);
      currentString = "";
    }
  });

  parser.parseString(xmlString);
}

function getTextAsHtml(teiDoc) {
  const front = getElemByXpath(teiDoc, "//text/front");
  // const body = getElemByXpath(teiDoc, "//text/body");

  toHtml(front.toString());
  return "";
}

module.exports = { parseTei, getFrontmatter, getTextAsHtml };
