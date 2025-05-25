# Decap CMS Integration

This directory contains the configuration and interface files for Decap CMS, which provides a user-friendly content management interface for this Jekyll site.

## Files

- `index.html`: The admin interface entry point
- `config.yml`: Configuration for Decap CMS collections and fields

## Authentication

Decap CMS uses GitHub OAuth for authentication. For production use, you'll need to:

1. Create a GitHub OAuth application
2. Set up an authentication provider
3. Update the `config.yml` file with your OAuth settings

For detailed setup instructions, see the [Decap CMS Guide](../docs/decap-cms-guide.md).

## Local Development

For local development, you can use the local backend:

1. Add to your `config.yml`:
   ```yaml
   local_backend: true
   ```

2. Run the local server:
   ```bash
   npx @staticcms/proxy-server
   ```

3. Start your Jekyll server:
   ```bash
   bundle exec jekyll serve
   ```

4. Access the CMS at `http://localhost:4000/admin/`

## Customization

You can customize the CMS by:

- Modifying `config.yml` to change collections and fields
- Updating `index.html` to change the admin interface appearance
- Adding custom preview templates and widgets

## Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub Authentication](https://decapcms.org/docs/github-backend/)
- [Custom Widgets](https://decapcms.org/docs/custom-widgets/)