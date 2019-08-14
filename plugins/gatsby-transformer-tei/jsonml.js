const { Parser } = require("node-expat");

const JsonMlDoc = class {
  constructor(xmlString, debug = false) {
    this.debug = debug;
    this.render = {};
    this.skipTags = [];
    this.parse(xmlString);
  }

  parse(content) {
    const nodeStack = [];
    const encoding = "UTF-8";
    const parser = new Parser(encoding);
    const data = Buffer.from(content, encoding);

    let node;
    let partial = "";

    parser.on("startElement", (name, attrs) => {
      const newNode = [name];

      if (partial) {
        node.push(partial);
        partial = "";
      }

      if (Object.entries(attrs).length > 0) newNode.push(attrs);

      if (node) {
        node.push(newNode);
        nodeStack.push(node);
      }

      node = newNode;
    });

    parser.on("endElement", (/* name */) => {
      if (partial) {
        node.push(partial);
        partial = "";
      }

      if (nodeStack.length === 0) this.doc = node;

      node = nodeStack.pop();
    });

    parser.on("text", function _text(text) {
      const textContent = text.replace(/[\r\n\t]*/, "");
      partial += textContent;
    });

    if (!parser.parse(data, true)) {
      throw new Error(`Could not parse XML: ${parser.getError()}`);
    }
  }

  getFirstTextContent(elemPath) {
    const elem = [...this.getElemByPath(elemPath)];
    elem.shift(); // drop the tag
    // return first element which is a string
    return elem.find(child => typeof child === "string");
  }

  getElemByName(elemName, parent = this.doc, condition = () => true) {
    return parent.reduce((accumulator, elem) => {
      if (accumulator) return accumulator;
      if (Array.isArray(elem)) {
        if (elem[0] === elemName && condition(elem)) return elem;
        return this.getElemByName(elemName, elem, condition);
      }
      return false;
    }, null);
  }

  getElemsByName(elemName, parent = this.doc, condition = () => true) {
    let matchedElems = [];
    parent.forEach(elem => {
      if (Array.isArray(elem)) {
        if (elem[0] === elemName && condition(elem)) {
          matchedElems.push(elem);
        } else {
          matchedElems = matchedElems.concat(
            this.getElemsByName(elemName, elem, condition)
          );
        }
      }
    });
    return matchedElems;
  }

  getElemByPath(elemPath) {
    // elemPath is an xPath-like expression, currently limited to descendant
    // selectors (i.e. tag/tag/tag) and attribute equality (tag[@attr='val'])
    // Missing (not necessarily todo...):
    //  * distinguish prefixes (/, //, ./ -- root, anywhere, relative)
    //  * more-or-less everything else
    let currentElem = this.doc;
    elemPath.split("/").forEach(expr => {
      if (!expr) return;
      const {
        groups: { path, attr, val }
      } = /(?<path>[^[]+)(?:\[@(?<attr>[^=]+)=["'](?<val>[^'"]+)["']\])?/.exec(
        expr
      );
      currentElem = this.getElemByName(
        path,
        currentElem,
        attr && val ? elem => elem[1][attr] === val : () => true
      );
    });
    return currentElem;
  }

  toHtml(_elem = this.doc, html = "") {
    const elem = [..._elem];
    const tag = elem.shift();
    const attrs = elem[0] instanceof Object ? elem.shift() : {};

    let newHtml = html;

    if (Object.keys(this.render).includes(tag)) {
      newHtml += this.render[tag](elem, attrs, this);
    } else {
      if (this.debug && tag !== null)
        // eslint-disable-next-line no-console
        console.log(`passing through tag: ${JsonMlDoc.renderTag(_elem)}`);
      elem.forEach(child => {
        if (Array.isArray(child)) {
          newHtml += this.toHtml(child);
        } else if (typeof child === "string") {
          newHtml += child;
        }
      });
    }
    return newHtml.replace(/\s+/g, " ").trim();
  }

  static renderTag(elem) {
    // convenience method for development/debugging
    const tag = elem[0];
    const attrsString =
      elem[1] instanceof Object
        ? ` ${Object.entries(elem[1])
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")}`
        : "";
    return `<${tag}${attrsString} />`;
  }
};

module.exports.JsonMlDoc = JsonMlDoc;
