import React from "react";

import { post } from "axios";

import Layout from "../components/layout";
import Meta from "../components/meta";

import { ArticleBody, Footnotes } from "../ui-components/article-elements";
import {
  ControlsPanel,
  controlsTipStyles,
  ControlButton,
  ToggleButton
} from "../ui-components/proofing-elements";
import Tooltip from "../ui-components/tooltip";
import LoadingSpinner from "../ui-components/loading-spinner";

import TeiDoc from "../../plugins/gatsby-transformer-tei/tei";
import TeiRenderer from "../utils/tei-renderer";

const ENTITY_TYPES = [
  ["PERSON", "People, including fictional."],
  ["NORP", "Nationalities or religious or political groups."],
  ["FAC", "Buildings, airports, highways, bridges, etc."],
  ["ORG", "Companies, agencies, institutions, etc."],
  ["GPE", "Countries, cities, states."],
  ["LOC", "Non-GPE locations, mountain ranges, bodies of water."],
  ["PRODUCT", "Objects, vehicles, foods, etc. (Not services.)"],
  ["EVENT", "Named hurricanes, battles, wars, sports events, etc."],
  ["WORK_OF_ART", "Titles of books, songs, etc."],
  ["LAW", "Named documents made into laws."],
  ["LANGUAGE", "Any named language."],
  ["DATE", "Absolute or relative dates or periods."],
  ["TIME", "Times smaller than a day."],
  ["PERCENT", "Percentage, including ”%“."],
  ["MONEY", "Monetary values, including unit."],
  ["QUANTITY", "Measurements, as of weight or distance."],
  ["ORDINAL", "“first”, “second”, etc."],
  ["CARDINAL", "Numerals that do not fall under another type."]
];

class ProofingPage extends React.Component {
  static sendFileForNerMarkup(file, model, include) {
    const url = process.env.NLP_API_ENDPOINT;
    const formData = new FormData();
    formData.append("xml", file);
    formData.set("model", model);
    formData.set("include", include);
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
      teiNode: null,
      loading: false
    };
  }

  onNewFile = event => {
    const teiFile = event.target.files[0];
    this.setState({ teiFile, loading: true }, () => this.readTeiFile());
  };

  onNerSubmit = event => {
    event.preventDefault();
    const include = Array.from(event.target.include)
      .filter(elem => elem.checked)
      .map(elem => elem.value)
      .join("|");
    this.setState({ loading: true });
    this.getMarkedUpTei(event.target.model.value, include);
  };

  onRenderClick = (/* event */) => this.readTeiFile();

  onClearClick = (/* event */) => this.setState({ teiNode: null });

  getMarkedUpTei(model, include) {
    const { teiFile } = this.state;
    ProofingPage.sendFileForNerMarkup(teiFile, model, include).then(
      response => {
        this.setState({ teiXml: response.data }, () => this.makeTeiNode());
      }
    );
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
    this.setState({ teiNode }, () => this.setState({ loading: false }));
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
    const { teiFile, teiNode, loading } = this.state;
    const article = teiNode
      ? (() => {
          const teiRenderer = new TeiRenderer(teiNode);
          return (
            <>
              <ArticleBody>{teiRenderer.articleBody()}</ArticleBody>
              <Footnotes>{teiRenderer.footnotes()}</Footnotes>
            </>
          );
        })()
      : "";
    return (
      <Layout>
        <Meta title="Proofing Page" />
        {loading ? (
          <LoadingSpinner color={({ theme }) => theme.colors.main} />
        ) : (
          ""
        )}
        <ControlsPanel>
          <div>
            <input type="file" name="input-file" onChange={this.onNewFile} />
            {teiFile && !teiNode ? (
              <ControlButton type="button" onClick={this.onRenderClick}>
                Re-Render
              </ControlButton>
            ) : (
              ""
            )}
            {teiNode ? (
              <ControlButton type="button" onClick={this.onClearClick}>
                Clear
              </ControlButton>
            ) : (
              ""
            )}
          </div>
          {teiNode ? (
            <>
              <ToggleButton
                onClick={event => {
                  event.target.classList.toggle("shown");
                }}>
                NER Tools
              </ToggleButton>
              <form onSubmit={this.onNerSubmit}>
                <div>
                  <fieldset>
                    <legend>Model</legend>
                    <Tooltip
                      tipContent="English multi-task CNN trained on OntoNotes v5."
                      tipStyles={controlsTipStyles}>
                      <label htmlFor="en_core_web_sm">
                        <input
                          type="radio"
                          name="model"
                          id="en_core_web_sm"
                          value="en_core_web_sm"
                          defaultChecked
                        />
                        en_core_web_sm
                      </label>
                    </Tooltip>
                    <Tooltip
                      tipContent="English multi-task CNN trained on OntoNotes v5, with GloVe vectors trained on Common Crawl."
                      tipStyles={controlsTipStyles}>
                      <label htmlFor="en_core_web_lg">
                        <input
                          type="radio"
                          name="model"
                          id="en_core_web_lg"
                          value="en_core_web_lg"
                        />
                        en_core_web_lg
                      </label>
                    </Tooltip>
                  </fieldset>
                  <fieldset>
                    <legend>Include</legend>
                    {ENTITY_TYPES.map(([entityType, entityDesc]) => (
                      <div key={entityType}>
                        <Tooltip
                          placement="right"
                          tipContent={entityDesc}
                          tipStyles={controlsTipStyles}>
                          <label htmlFor={entityType}>
                            <input
                              type="checkbox"
                              name="include"
                              id={entityType}
                              value={entityType}
                              defaultChecked
                            />
                            {entityType}
                          </label>
                        </Tooltip>
                      </div>
                    ))}
                    <div>
                      <ControlButton
                        type="button"
                        onClick={event =>
                          Array.from(event.target.form.include).forEach(
                            checkbox => {
                              checkbox.checked = true;
                            }
                          )
                        }>
                        Select All
                      </ControlButton>
                      <ControlButton
                        type="button"
                        onClick={event =>
                          Array.from(event.target.form.include).forEach(
                            checkbox => {
                              checkbox.checked = false;
                            }
                          )
                        }>
                        Select None
                      </ControlButton>
                    </div>
                  </fieldset>
                </div>
                <div>
                  <Tooltip
                    tipContent="Send document for NER markup and render result."
                    tipStyles={controlsTipStyles}>
                    <ControlButton type="submit">Markup Entities</ControlButton>
                  </Tooltip>
                </div>
              </form>
            </>
          ) : (
            ""
          )}
        </ControlsPanel>
        {article}
      </Layout>
    );
  }
}

export default ProofingPage;
