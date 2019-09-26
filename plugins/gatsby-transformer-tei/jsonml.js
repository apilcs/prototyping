import sax from "./sax";

const JsonMlDoc = class {
  constructor(xmlString, debug = false) {
    this.debug = debug;
    this.renderToHtml = {};
    this.skipExprs = [];
    this.parse(xmlString);
  }

  parse(content) {
    const nodeStack = [];
    const encoding = "UTF-8";
    const parser = sax.parser(true, { xmlns: true });
    const data = Buffer.from(content, encoding);

    let node;
    let partial = "";

    parser.onopentag = ({ name, attributes = {} }) => {
      const newNode = [name];

      if (partial) {
        node.push(partial);
        partial = "";
      }

      if (Object.entries(attributes).length > 0) {
        newNode.push(
          Object.keys(attributes).reduce((acc, k) => {
            acc[k] = attributes[k].value;
            return acc;
          }, {})
        );
      }

      if (node) {
        node.push(newNode);
        nodeStack.push(node);
      }

      node = newNode;
    };

    parser.onclosetag = (/* name */) => {
      if (partial) {
        node.push(partial);
        partial = "";
      }

      if (nodeStack.length === 0) this.doc = node;

      node = nodeStack.pop();
    };

    parser.ontext = function _text(text) {
      const textContent = text.replace(/[\r\n\t]*/, "");
      partial += textContent;
    };

    parser.write(data).close();
    // if (!parser.parse(data, true)) {
    //   throw new Error(`Could not parse XML: ${parser.getError()}`);
    // }
  }

  getFirstTextContent(elemPath) {
    let elem = this.getElemByPath(elemPath);
    if (!elem) return "";
    elem = [...this.getElemByPath(elemPath)];
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
    //  - distinguish prefixes (/, //, ./ -- root, anywhere, relative)
    //  - more-or-less everything else
    let currentElem = this.doc;
    elemPath.split("/").forEach(expr => {
      if (!expr) return;
      const { tag, attr, val } = this.constructor.parseExpr(expr);
      currentElem = this.getElemByName(
        tag,
        currentElem,
        attr && val ? elem => elem[1][attr] === val : () => true
      );
    });
    return currentElem;
  }

  toHtml(_elem = this.doc, parent = null) {
    const elem = [..._elem];
    const tag = elem.shift();
    const attrs = elem[0] instanceof Object ? elem.shift() : {};

    let newHtml = "";

    if (Object.keys(this.renderToHtml).includes(tag) && !this.skipElem(_elem)) {
      newHtml += this.renderToHtml[tag](elem, attrs, this, parent);
    } else {
      if (this.debug && tag !== null && !this.skipElem(_elem))
        // eslint-disable-next-line no-console
        console.log(
          `passing through tag: ${this.constructor.renderTag(_elem)}`
        );
      elem.forEach(child => {
        if (Array.isArray(child)) {
          newHtml += this.toHtml(child, _elem);
        } else if (typeof child === "string") {
          newHtml += child;
        }
      });
    }
    return newHtml.replace(/\s+/g, " ").trim();
  }

  skipElem(elem) {
    return this.skipExprs.some(expr =>
      this.constructor.elemMatchesExpr(elem, expr)
    );
  }

  static parseExpr(expr) {
    return /(?<tag>[^[]+)(?:\[@(?<attr>[^=]+)=["'](?<val>[^'"]+)["']\])?/.exec(
      expr
    ).groups;
  }

  static elemMatchesExpr(elem, expr) {
    const { tag, attr, val } = this.parseExpr(expr);
    return elem[0] === tag && elem[1][attr] === val;
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

export default JsonMlDoc;
