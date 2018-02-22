const path = require("path");
const _ = require('lodash');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            excerpt(pruneLength: 400)
            html
            id
            frontmatter {
              templateKey
              title
              path
              date
              thumbnail
              tags
              images {
                description
                image
              }
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    return result.data.allMarkdownRemark.edges
      .filter(({ node }) => node.frontmatter.templateKey != 'video-post')
      .forEach(({ node }) => {
        const pagePath = node.frontmatter.path;

        let imagesToExtract = getImagesToExtract(node.frontmatter);

        createPage({
          path: pagePath,
          component: path.resolve(
            `src/templates/${String(node.frontmatter.templateKey)}.js`
          ),
          // additional data can be passed via context
          context: {
            path: pagePath,
            // if images to extract is empty, then pass an "impossible" regexp
            imageExp: !_.isEmpty(imagesToExtract) ? new RegExp(imagesToExtract.join('|')) : /\Zx\A/
          }
        });
      });
  });
};

function getImagesToExtract(frontmatter) {
  let imagesToExtract = [];

  if (frontmatter.images && frontmatter.images.length && frontmatter.images.forEach) {
    frontmatter.images.filter(i => i.image).forEach(i => imagesToExtract.push(i.image));
  }
  if (frontmatter.thumbnail) {
    imagesToExtract.push(frontmatter.thumbnail);
  }

  return imagesToExtract;
}
