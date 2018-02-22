import React from 'react';
import graphql from 'graphql';
import Helmet from 'react-helmet';
import Content, { HTMLContent } from '../components/Content';

export const ImagePostTemplate = ({ title, content, contentComponent, helmet }) => {
  const PageContent = contentComponent || Content;

  return (
    <div>
      { helmet || ''}
      <PageContent className="content" content={content} />
    </div>
  );
};

export default ({ data, pathContext }) => {
  const { markdownRemark: post } = data;

  return (<ImagePostTemplate
    contentComponent={HTMLContent}
    title={post.frontmatter.title}
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