import React from 'react';
import graphql from 'graphql';
import Helmet from 'react-helmet';
import Content, { HTMLContent } from '../components/Content';

export const TextPostTemplate = ({ title, content, contentComponent, helmet }) => {
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

  return (<TextPostTemplate
    contentComponent={HTMLContent}
    title={post.frontmatter.title}
    content={post.html}
    helmet={<Helmet title={`${post.frontmatter.title}`} />}
  />);
};

export const textPostQuery = graphql`
  query TextPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;