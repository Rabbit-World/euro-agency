// Preview Templates for Decap CMS
// This file enhances the CMS preview experience

// Register the Post preview template
CMS.registerPreviewTemplate('posts', createClass({
  render: function() {
    const entry = this.props.entry;
    const date = entry.getIn(['data', 'date']);
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
    
    return h('div', {className: "post-preview"},
      h('div', {className: "post-header"},
        h('h1', {}, entry.getIn(['data', 'title'])),
        h('div', {className: "post-meta"},
          h('span', {className: "post-date"}, formattedDate),
          h('span', {className: "post-categories"}, 
            entry.getIn(['data', 'categories']) && 
            entry.getIn(['data', 'categories']).map(category => 
              h('span', {className: "category-tag"}, category)
            )
          )
        )
      ),
      h('div', {className: "featured-image"},
        entry.getIn(['data', 'image']) && 
        h('img', {
          src: entry.getIn(['data', 'image']),
          alt: entry.getIn(['data', 'image_alt']) || entry.getIn(['data', 'title'])
        })
      ),
      h('div', {className: "post-content"}, 
        this.props.widgetFor('body')
      )
    );
  }
}));

// Register the Page preview template
CMS.registerPreviewTemplate('pages', createClass({
  render: function() {
    const entry = this.props.entry;
    
    return h('div', {className: "page-preview"},
      h('div', {className: "page-header"},
        h('h1', {}, entry.getIn(['data', 'title']))
      ),
      h('div', {className: "featured-image"},
        entry.getIn(['data', 'image']) && 
        h('img', {
          src: entry.getIn(['data', 'image']),
          alt: entry.getIn(['data', 'image_alt']) || entry.getIn(['data', 'title'])
        })
      ),
      h('div', {className: "page-content"}, 
        this.props.widgetFor('body')
      )
    );
  }
}));

// Add custom preview styles
CMS.registerPreviewStyle(`
  .post-preview, .page-preview {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .post-header, .page-header {
    margin-bottom: 20px;
  }
  
  .post-meta {
    color: #666;
    font-size: 0.9rem;
    margin-top: 10px;
  }
  
  .post-date {
    margin-right: 15px;
  }
  
  .category-tag {
    background: #f0f0f0;
    padding: 3px 8px;
    border-radius: 3px;
    margin-right: 5px;
    font-size: 0.8rem;
  }
  
  .featured-image {
    margin-bottom: 20px;
  }
  
  .featured-image img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .post-content, .page-content {
    line-height: 1.6;
  }
  
  .post-content img, .page-content img {
    max-width: 100%;
    height: auto;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 1em;
    color: #666;
    font-style: italic;
  }
  
  pre, code {
    background: #f5f5f5;
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-family: monospace;
  }
  
  pre {
    padding: 1em;
    overflow-x: auto;
  }
  
  a {
    color: #0366d6;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
`);