/**
 * Repository Browser Widget for Decap CMS
 * 
 * This widget allows browsing the GitHub repository structure
 * directly from the CMS interface.
 */

// Define the control component for the widget
const RepositoryBrowserControl = createClass({
  handleChange: function(e) {
    this.props.onChange(e.target.value);
  },

  render: function() {
    const {value, forID} = this.props;
    const currentPath = value || '';
    
    return h('div', {className: 'repository-browser-widget'},
      h('div', {className: 'repo-browser-header'},
        h('h3', {}, 'Repository Browser'),
        h('p', {}, 'Browse the repository structure and select files')
      ),
      h('div', {className: 'repo-browser-path'},
        h('label', {htmlFor: forID}, 'Current Path:'),
        h('input', {
          type: 'text',
          id: forID,
          value: currentPath,
          onChange: this.handleChange,
          className: 'repo-path-input'
        })
      ),
      h('div', {className: 'repo-browser-content'},
        h('p', {}, 'Repository content will load here when implemented with GitHub API')
      ),
      h('style', {}, `
        .repository-browser-widget {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
          background: #f9f9f9;
        }
        
        .repo-browser-header {
          margin-bottom: 16px;
        }
        
        .repo-browser-header h3 {
          margin: 0 0 8px 0;
        }
        
        .repo-browser-header p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .repo-browser-path {
          margin-bottom: 16px;
        }
        
        .repo-path-input {
          display: block;
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .repo-browser-content {
          min-height: 200px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          background: white;
        }
      `)
    );
  }
});

// Define the preview component for the widget
const RepositoryBrowserPreview = createClass({
  render: function() {
    const {value} = this.props;
    return h('div', {className: 'repo-browser-preview'},
      h('p', {}, 'Repository Browser: ' + (value || 'No path selected'))
    );
  }
});

// Register the custom widget
CMS.registerWidget('repository-browser', RepositoryBrowserControl, RepositoryBrowserPreview);