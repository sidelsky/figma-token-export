# GitHub Integration Feature

## Overview

The Figma Design Token Export plugin now includes **GitHub Push Integration**, allowing you to automatically push exported design tokens directly to a GitHub repository without leaving Figma.

## Features

✅ **One-Click Push** - Push tokens to GitHub with a single click  
✅ **Multiple Formats** - Push as W3C JSON, CSS, or complete JSON  
✅ **Settings Persistence** - Save your repository configuration  
✅ **Automatic Updates** - Creates or updates files automatically  
✅ **Commit Links** - Direct links to view your commits on GitHub  

## Setup Guide

### 1. Create a GitHub Personal Access Token (PAT)

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new?scopes=repo&description=Figma%20Token%20Export)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: `Figma Token Export`
4. Select the **`repo`** scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** - you won't be able to see it again!

### 2. Configure the Plugin

1. Open your Figma file
2. Run the **Design Token Export** plugin
3. Click **"Export Design Tokens"** to extract your tokens
4. The **"🔗 Push to GitHub"** section will appear
5. Fill in the configuration:

   - **Repository URL**: `username/repo` or `https://github.com/username/repo`
   - **Branch**: `main` (or your target branch)
   - **File Path**: `tokens/design-tokens.json` (or your preferred path)
   - **GitHub Token**: Paste your PAT
   - **Commit Message**: Customize your commit message

6. Click **"💾 Save Settings"** to save your configuration

### 3. Push to GitHub

1. Select your desired export format (JSON, CSS, or Developer JSON)
2. Click **"🚀 Push to GitHub"**
3. Wait for the success message
4. Click **"View commit →"** to see your changes on GitHub

## Configuration Options

### Repository URL Formats

The plugin accepts multiple repository URL formats:

```
username/repo
https://github.com/username/repo
git@github.com:username/repo.git
```

### File Path

Specify where to save the tokens in your repository:

```
tokens/design-tokens.json          # Recommended
src/styles/tokens.json
config/design-system/tokens.css
```

The plugin will:
- Create the file if it doesn't exist
- Update the file if it already exists
- Create parent directories automatically

### Branch

Specify which branch to push to:

```
main                    # Default branch
develop                 # Development branch
feature/new-tokens      # Feature branch
```

**Note**: The branch must already exist in your repository.

## Export Formats

### Developer JSON (W3C Format) ⭐ Recommended

Clean, production-ready format following W3C standards:

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#0095ff",
      "$description": "Primary brand color"
    }
  }
}
```

### CSS Custom Properties

Ready-to-use CSS variables:

```css
:root {
  --colors-primary: #0095ff;
  --spacing-base: 16px;
}
```

### Complete JSON

Full export with all Figma metadata:

```json
{
  "metadata": {
    "exportedAt": "2024-01-23T12:00:00.000Z",
    "collections": 2
  },
  "collections": { ... }
}
```

## Security Best Practices

### Token Storage

The plugin offers two options for storing your GitHub token:

1. **Save with settings** (convenient)
   - Token is saved in browser localStorage
   - Automatically filled in on next use
   - ⚠️ Less secure if others use your computer

2. **Enter each time** (more secure)
   - Don't check "Save token"
   - Enter token manually each time
   - ✅ Recommended for shared computers

### Token Permissions

Your GitHub token only needs the **`repo`** scope:

- ✅ Allows: Push to repositories you have access to
- ❌ Does NOT allow: Delete repositories, modify settings, access other scopes

### Revoking Access

If you need to revoke access:

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Find "Figma Token Export"
3. Click "Delete"

## Workflow Examples

### Basic Workflow

```
1. Design in Figma
2. Export tokens → Click "Export Design Tokens"
3. Review preview
4. Push to GitHub → Click "🚀 Push to GitHub"
5. Tokens are now in your repository!
```

### Team Workflow

```
1. Designer updates colors in Figma
2. Export tokens to GitHub
3. Create pull request (manually on GitHub)
4. Team reviews changes
5. Merge to main branch
6. CI/CD picks up changes
7. Design system automatically updates
```

### Multi-Format Workflow

```
1. Export as Developer JSON → Push to tokens/design-tokens.json
2. Switch format to CSS
3. Push to src/styles/tokens.css
4. Both formats now available in repository
```

## Troubleshooting

### "Invalid repository URL format"

**Problem**: The repository URL is not recognized

**Solution**: Use one of these formats:
- `username/repo`
- `https://github.com/username/repo`

### "Invalid token"

**Problem**: GitHub rejects your Personal Access Token

**Solutions**:
- Verify the token is copied correctly (no extra spaces)
- Check the token hasn't expired
- Ensure the token has `repo` scope
- Generate a new token if needed

### "Repository not found"

**Problem**: The plugin can't find your repository

**Solutions**:
- Verify the repository name is correct
- Check you have access to the repository
- Ensure the repository exists on GitHub
- For private repos, verify your token has `repo` scope

### "You do not have push access"

**Problem**: Your token doesn't have permission to push

**Solutions**:
- Verify you have write access to the repository
- Check the token has `repo` scope
- Ask the repository owner to grant you push access

### "Failed to push to GitHub"

**Problem**: Generic push error

**Solutions**:
- Check your internet connection
- Verify the branch exists
- Try again (temporary GitHub API issue)
- Check GitHub status page

## Network Requirements

The plugin requires network access to:
- `https://api.github.com` - GitHub REST API

This is configured in the plugin's `manifest.json`.

## Limitations

- ✅ Works with GitHub.com
- ❌ Does not support GitHub Enterprise Server
- ❌ Does not support GitLab or Bitbucket
- ❌ Cannot create new branches (branch must exist)
- ❌ Cannot create pull requests (push only)

## Future Enhancements

Potential features for future versions:

- 🔄 Pull tokens from GitHub into Figma
- 🌿 Create new branches
- 📝 Create pull requests directly
- 🔀 Branch switching
- 📊 Change detection
- 🏢 GitHub Enterprise support

## Support

For issues or questions:

1. Check this documentation
2. Review the [README](README.md)
3. Open an issue on GitHub
4. Check the [Troubleshooting](#troubleshooting) section

## Technical Details

### API Usage

The plugin uses the GitHub REST API v3:

- **Endpoint**: `PUT /repos/{owner}/{repo}/contents/{path}`
- **Authentication**: Bearer token (Personal Access Token)
- **Content**: Base64-encoded file content

### File Updates

When pushing to GitHub:

1. Plugin checks if file exists (GET request)
2. If exists, retrieves current SHA
3. Creates/updates file with new content (PUT request)
4. Returns commit URL for verification

### Data Flow

```
Figma Variables
    ↓
Export & Convert (JSON/CSS/Developer)
    ↓
GitHub API (Base64 encode)
    ↓
Repository File
```

## Version History

### v1.3.0 (2024-01-23)
- ✨ Added GitHub Push integration
- 🔧 Settings persistence
- 🔗 Commit URL links
- 🔒 Secure token handling

---

**Made with ❤️ for design systems teams**
