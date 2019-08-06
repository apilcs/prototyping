// Create pages from markdown in /content/.  This, in conjunction
//  with the code in `/templates/static-page.js`, is a bit hacky,
//  but allows nice multilingual content to be loaded from /content/
//  and served appropriately view react-intl.  Better ways to do
//  this should be possible once react-intl 3.x is released and
//  supported by gatsby-plugin-intl, but until then this will
//  suffice.

const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    // nodes are created for all markdown files in /content/ with
    //  slug values (that will become URL paths) and lang values
    //  (to facilitate i18n).  `.<lang>.md` suffixes are stripped
    //  from the slug, such that slugs will not be unique where
    //  multilingual nodes exist for the same slug.
    let slug = createFilePath({ node, getNode, basePath: `pages` });
    let lang;

    if (slug.match(/\.(en|zh)\/$/)) {
      lang = slug.slice(-3, -1);
      slug = slug.replace(/\.(en|zh)\/$/, "/");
    }

    // special case
    if (slug === "/index/") slug = "/";

    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
    createNodeField({
      node,
      name: `lang`,
      value: lang
    });
  }
};

exports.createPages = async function createPages({ actions, graphql }) {
  // pages are created for each available markdown node.  Since
  //  slugs are not unique where multilingual sets of nodes exist
  //  (a markdown node in each available language, each with the same
  //  slug), each successive node overwrites any existing page at the
  //  same path -- this is fine, as this only happens at build-time,
  //  and all we require is that, in the end, a page exists at the
  //  appropriate path that points to the `StaticPage` component
  //  and receives the appropriate slug in context.
  const { data } = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  data.allMarkdownRemark.edges.forEach(edge => {
    const { slug } = edge.node.fields;
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/templates/static-page.js`),
      context: { slug }
    });
  });
};
