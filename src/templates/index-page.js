import React from "react";
import Link from "gatsby-link";
import Script from "react-load-script";
import graphql from "graphql";
import Img from 'gatsby-image';
import * as _ from 'lodash';
import { combineImagesharpWithContent } from '../utils/image-utils';

export default class IndexPage extends React.Component {
  handleScriptLoad() {
    if (typeof window !== `undefined` && window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
    window.netlifyIdentity.init();
  }

  render() {
    const { data: { allMarkdownRemark, allImageSharp } } = this.props;
    let remarkNodes = _.map(_.get(allMarkdownRemark, 'edges'), 'node');
    let sharpNodes = _.map(_.get(allImageSharp, 'edges'), 'node');

    function getThumbnail(frontmatter) {
      let thumbnailId = _.get(frontmatter, 'thumbnail');

      if (!thumbnailId) return;
      
      var thumbnail = _.first(combineImagesharpWithContent(sharpNodes, [{ image: thumbnailId }]));

      if (!_.get(thumbnail, ['image', 'sizes'])) return;

      return <Img sizes={thumbnail.image.sizes} />
    }

    return (
      <div>
        <Script
          url="https://identity.netlify.com/v1/netlify-identity-widget.js"
          onLoad={() => this.handleScriptLoad()}
        />
        {remarkNodes.map((n) => <div key={n.frontmatter.path}>
        
        {getThumbnail(n.frontmatter)}
        <Link to={n.frontmatter.path}>{n.frontmatter.title}</Link>

        </div>)}
      </div>
    );
  }
}

export const pageQuery = graphql`
  query IndexQuery($imageExp: String) {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          frontmatter {
            title
            thumbnail
            templateKey
            date(formatString: "MMMM DD, YYYY")
            path
          }
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
