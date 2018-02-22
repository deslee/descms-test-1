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

    // generate the index page
    let frontPageThumbnails = result.data.allMarkdownRemark.edges.map(({ node }) => extractThumbnailFromFrontmatter(node.frontmatter));
    frontPageThumbnails.join('|')
    createPage({
      path: '/',
      component: path.resolve(
        `src/templates/index-page.js`
      ),
      // additional data can be passed via context
      context: {
        imageExp: convertListOfIdsToRegex(frontPageThumbnails)
      }
    })

    // generate tags
    let tags = result.data.allMarkdownRemark.edges
      .map(({node}) => _.get(node, ['frontmatter', 'tags'], []) || []).reduce((cur, val) => { return cur.concat(val) } ,[]);
    tags = _.uniq(tags);
    tags.forEach(tag => {
      createPage({
        path: `tags/${tag}`,
        component: path.resolve(
          `src/templates/tag-page.js`
        ),
        context: {
          tag: tag,
          imageExp: convertListOfIdsToRegex(frontPageThumbnails) // TODO: thumbnails specific to each tag page
        }
      })
    });


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
            imageExp: convertListOfIdsToRegex(imagesToExtract)
          }
        });
      });
  });
};

function convertListOfIdsToRegex(list) {
  return !_.isEmpty(list) ? new RegExp(list.join('|')) : /\Zx\A/
}

function extractImagesFromFrontmatter(frontmatter) {
  let images = _.get(frontmatter, 'images', []) || [];
  return images.filter(i => i.image).map(i => i.image);
}

function extractThumbnailFromFrontmatter(frontmatter) {
  return _.get(frontmatter, ['thumbnail']);
}

function getImagesToExtract(frontmatter) {
  let imagesToExtract = [].concat(extractImagesFromFrontmatter(frontmatter));

  var thumbnail = extractThumbnailFromFrontmatter(frontmatter);
  if (thumbnail) {
    imagesToExtract.push(thumbnail);
  }

  return imagesToExtract;
}
