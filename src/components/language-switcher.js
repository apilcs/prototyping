import React from "react";
import { IntlContextConsumer, changeLocale } from "gatsby-plugin-intl";
import styled from "styled-components";

const languageName = {
  en: "English",
  zh: "中文"
};

const Container = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  color: ${props => (props.activeLocale ? "yellow" : "white")};
  cursor: pointer;
  margin: 10;
`;

const LanguageSwitcher = () => {
  return (
    <Container>
      <IntlContextConsumer>
        {({ languages, language: currentLocale }) =>
          languages.map(language => (
            <LanguageButton
              type="button"
              key={language}
              onClick={() => changeLocale(language === "en" ? "" : language)}
              activeLocale={currentLocale === language}>
              {languageName[language]}
            </LanguageButton>
          ))
        }
      </IntlContextConsumer>
    </Container>
  );
};

export default LanguageSwitcher;
