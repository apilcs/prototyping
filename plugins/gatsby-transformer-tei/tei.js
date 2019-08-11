function parseTei(xmlString) {
  return {};
}

function getFrontmatter(teiDoc) {
  return {
    title: "<title goes here>",
    author: "<author goes here>"
  };
}

module.exports = { parseTei, getFrontmatter };
