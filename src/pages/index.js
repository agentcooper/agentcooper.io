import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { rhythm } from "../utils/typography";

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    const blogPosts = data.posts.edges;
    const pageItems = data.pages.edges;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <h3>Posts</h3>
            {blogPosts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug;
              return (
                <article key={node.fields.slug}>
                  <h3
                    style={{
                      fontWeight: "normal",
                      marginTop: "1.2em",
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link to={node.fields.slug}>{title}</Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </article>
              );
            })}
          </div>
          <div style={{ marginLeft: "4em" }}>
            <h3>Pages</h3>
            {pageItems.map(({ node }) => {
              return (
                <article
                  key={node.fields.slug}
                  style={{ marginBottom: "0.5em" }}
                >
                  <header>
                    <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                  </header>
                </article>
              );
            })}
          </div>
        </div>

        <footer>
          <h3>Contact me</h3>
          <p>
            <a href="mailto:artem.tyurin@gmail.com">Email</a>,{" "}
            <a href="https://github.com/agentcooper">GitHub</a>
          </p>
        </footer>
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { sourceName: { eq: "blog" } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            sourceName
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
    pages: allMarkdownRemark(
      sort: { fields: [frontmatter___title], order: ASC }
      filter: { fields: { sourceName: { eq: "pages" } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            sourceName
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
