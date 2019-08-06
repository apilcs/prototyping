import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { injectIntl } from "gatsby-plugin-intl";
import { intlShape } from "react-intl";

function Meta({ description, meta, title, intl }) {
  const metaDescription = description || intl.formatMessage({ id: "description" });

  return (
    <Helmet
      htmlAttributes={{ lang: intl.locale }}
      title={title}
      titleTemplate={`%s | ${intl.formatMessage({ id: "title" })}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: intl.formatMessage({ id: "author" })
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        }
      ].concat(meta)}
    />
  );
}

Meta.defaultProps = {
  meta: [],
  description: ``
};

Meta.propTypes = {
  description: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  intl: intlShape.isRequired
};

export default injectIntl(Meta);
