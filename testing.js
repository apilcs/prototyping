const fs = require("fs");

const {
  parseTei,
  getFrontmatter,
  getTextAsHtml
} = require(`./plugins/gatsby-transformer-tei/tei`);

const content = fs.readFileSync(
  `/home/simon/APILS/src/site/src/content/articles/Bingenheimer—Strangers_in_Paradise.tei.xml`
);

const teiDoc = parseTei(content.toString());
const html = getTextAsHtml(teiDoc);
