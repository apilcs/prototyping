import React from "react";
import { post } from "axios";

import Layout from "../components/layout";
import Meta from "../components/meta";

import {
  Abstract,
  ArticleBody,
  Footnotes
} from "../ui-components/article-elements";
import Tooltip from "../ui-components/tooltip";

import TeiDoc from "../../plugins/gatsby-transformer-tei/tei";
import TeiRenderer from "../utils/tei-renderer";

class ProofingPage extends React.Component {
  static fileUpload(file) {
    const url = "http://localhost:5000/ents";
    const formData = new FormData();
    formData.append("data_file", file);
    const config = {
      headers: { "content-type": "multipart/form-data" }
    };
    return post(url, formData, config);
  }

  constructor(props) {
    super(props);
    this.state = {
      teiFile: null,
      teiXml: null,
      teiNode: null
    };
  }

  onNewFile = event => {
    const teiFile = event.target.files[0];
    this.setState({ teiFile }, () => this.readTeiFile());
  };

  onNerClick = (/* event */) => this.getMarkedUpTei();

  onRenderClick = (/* event */) => this.readTeiFile();

  onClearClick = (/* event */) => this.setState({ teiNode: null });

  getMarkedUpTei() {
    const { teiFile } = this.state;
    ProofingPage.fileUpload(teiFile).then(response => {
      this.setState({ teiXml: response.data }, () => this.makeTeiNode());
    });
  }

  makeTeiNode() {
    const { teiXml } = this.state;
    const teiDoc = new TeiDoc(teiXml);
    const teiNode = {
      frontmatter: teiDoc.getFrontmatter(),
      titleHtml: teiDoc.getTitleHtml(),
      abstractHtml: teiDoc.getAbstractHtml(),
      articleBodyHtml: teiDoc.getArticleBodyHtml(),
      footnotesHtml: teiDoc.getFootnotesHtml(),
      images: teiDoc.getImagePaths()
    };
    this.setState({ teiNode });
  }

  readTeiFile() {
    const { teiFile } = this.state;
    if (teiFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = (/* event */) => {
        this.setState({ teiXml: fileReader.result }, () => this.makeTeiNode());
      };
      fileReader.readAsText(teiFile);
    }
  }

  render() {
    const { teiNode } = this.state;
    const article = teiNode
      ? (() => {
          const teiRenderer = new TeiRenderer(teiNode);
          return (
            <>
              <Abstract>{teiRenderer.abstract()}</Abstract>
              <ArticleBody>{teiRenderer.articleBody()}</ArticleBody>
              <Footnotes>{teiRenderer.footnotes()}</Footnotes>
            </>
          );
        })()
      : "";
    return (
      <Layout>
        <Meta title="Proofing Page" />
        <h1>Proofing Page</h1>
        <div>
          <input type="file" name="input-file" onChange={this.onNewFile} />
          <Tooltip tipContent="Send document for NER markup and render result.">
            <button type="button" onClick={this.onNerClick}>
              NER
            </button>
          </Tooltip>
          {teiNode ? (
            <button type="button" onClick={this.onClearClick}>
              Clear
            </button>
          ) : (
            <button type="button" onClick={this.onRenderClick}>
              Re-Render
            </button>
          )}
        </div>
        {article}
      </Layout>
    );
  }
}

export default ProofingPage;
