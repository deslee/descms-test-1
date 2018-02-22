import React from 'react';
import graphql from 'graphql';
import Helmet from 'react-helmet';
import Content, { HTMLContent } from '../components/Content';
import Img from 'gatsby-image';
import * as _ from 'lodash';
import { combineImagesharpWithContent } from '../utils/image-utils';

export const ImagePostTemplate = ({ title, images, content, contentComponent, helmet }) => {
  const PageContent = contentComponent || Content;

  return (
    <div>
      { helmet || ''}
      { images.map(i => 
      <div>
        <Img sizes={i.image.sizes} /><br />{i.description}
      </div>
      ) }
      <PageContent className="content" content={content} />
    </div>
  );
};

export default ({ data, pathContext }) => {
  const { markdownRemark: post, allImageSharp } = data;
  var imageSharps = _.get(allImageSharp, ['edges'], []).map(e => e.node);
  // get a list of images from the post
  var images = combineImagesharpWithContent(imageSharps, _.get(post, ['frontmatter', 'images'], []));
 
  return (<ImagePostTemplate
    contentComponent={HTMLContent}
    title={post.frontmatter.title}
    images={images}
    content={post.html}
    helmet={<Helmet title={`${post.frontmatter.title}`} />}
  />);
};

export const ImagePostQuery = graphql`
  query imagePostByPath($path: String!, $imageExp: String) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        thumbnail
        images {
            description
            image
        }
      }
    }
    allImageSharp(filter: {id: {regex: $imageExp}}) {
      edges {
        node {
          id
          sizes(maxWidth: 1920) {
            base64
            aspectRatio
            src
            srcSet
            sizes
          }
        }
      }
    }
  }
`;