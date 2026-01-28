# Publishing Your Figma Plugin

Complete guide to publishing the Design Token Export plugin to the Figma Community.

## 📋 Pre-Publication Checklist

### 1. Update Plugin Information

- [ ] **Update `package.json`**:
  - Replace "Your Name" with your actual name
  - Add your email
  - Update GitHub URLs with your actual repository
  
- [ ] **Update `README.md`**:
  - Replace placeholder GitHub URLs
  - Add screenshots/GIFs of the plugin in action
  - Ensure all documentation is accurate

- [ ] **Review `manifest.json`**:
  - Plugin name: "Design Token Export" ✅
  - Plugin ID is already set ✅
  - Menu items are correct ✅

### 2. Create Required Assets

Figma requires specific image assets for publication:

#### **Plugin Icon** (Required)
- **Size**: 128×128px and 256×256px (PNG)
- **Style**: Simple, recognizable icon
- **Suggestion**: Token/variable symbol, export arrow, or design system icon
- **Background**: Transparent or solid color
- **File names**: `icon-128.png`, `icon-256.png`

#### **Cover Image** (Required)
- **Size**: 1920×960px (PNG or JPG)
- **Content**: Hero image showing the plugin in action
- **Include**: 
  - Plugin interface screenshot
  - Example of exported tokens
  - Key features highlighted
  - Professional, clean design

#### **Screenshots** (Recommended, 3-5 images)
- **Size**: Any reasonable size (recommend 1200×800px or larger)
- **Show**:
  1. Main interface with export options
  2. Different export formats (W3C, CSS, React Native, etc.)
  3. Token preview
  4. Floating notifications in action
  5. Before/after comparison

### 3. Build for Production

```bash
# Clean build
npm run clean
npm run build

# Validate everything works
npm run validate

# Test the plugin one more time in Figma
```

### 4. Test Thoroughly

- [ ] Test with a file that has NO variables (error handling)
- [ ] Test with multiple collections
- [ ] Test with all export formats:
  - [ ] Developer JSON (W3C)
  - [ ] JSON (Complete)
  - [ ] CSS Custom Properties
  - [ ] SCSS/Sass
  - [ ] Tailwind Config
  - [ ] React Native
  - [ ] Flutter/Dart
  - [ ] iOS Swift
  - [ ] Android XML
- [ ] Test with light/dark modes
- [ ] Test with aliased variables
- [ ] Test download functionality
- [ ] Test copy to clipboard
- [ ] Test floating notifications appear/disappear correctly
- [ ] Test in different Figma file sizes

### 5. Prepare Plugin Description

Write a compelling description for the Figma Community:

**Title**: Design Token Export

**Tagline** (60 chars max):
"Export design variables to developer-friendly formats"

**Description** (use the template below):

```markdown
# Design Token Export

Export your Figma variables and design tokens into multiple developer-friendly formats with one click.

## ✨ Features

- **9 Export Formats**: W3C JSON, CSS, SCSS, Tailwind, React Native, Flutter, iOS, Android, and more
- **W3C Compliant**: Industry-standard format for design tokens
- **Multi-Mode Support**: Handles light/dark themes and multiple modes
- **Clean Interface**: Modern UI with floating notifications
- **Production Ready**: Battle-tested, TypeScript-based plugin

## 🎯 Perfect For

- Design system teams
- Frontend developers
- Design-to-code workflows
- Multi-platform projects

## 🚀 How to Use

1. Open the plugin
2. Select your export format
3. Click "Generate Design Tokens"
4. Download or copy to clipboard

## 📦 Export Formats

- **Developer JSON (W3C)** - Recommended for most projects
- **CSS Custom Properties** - Ready-to-use CSS variables
- **SCSS/Sass** - Variables and mixins
- **Tailwind Config** - Drop into tailwind.config.js
- **React Native** - Flattened JS object
- **Flutter/Dart** - Color classes
- **iOS Swift** - UIColor extensions
- **Android XML** - colors.xml format
- **JSON (Complete)** - Full Figma metadata

## 💡 Tips

- Use W3C format for maximum compatibility
- Export regularly to keep tokens in sync
- Integrate with your build pipeline

## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/figma-token-export)
- [Documentation](https://github.com/yourusername/figma-token-export#readme)
- [Report Issues](https://github.com/yourusername/figma-token-export/issues)
```

### 6. Choose Tags

Select relevant tags (max 3-5):
- `design-tokens`
- `export`
- `developer-tools`
- `design-system`
- `variables`

### 7. Set Pricing

- **Free** (recommended for community adoption)
- Or set a price if you prefer

## 🚀 Publishing Steps

### Step 1: Open Figma Desktop App

You can only publish plugins from the Figma desktop app, not the browser.

### Step 2: Navigate to Plugin Settings

1. Open Figma
2. Go to **Plugins** → **Development** → **Design Token Export**
3. Right-click on the plugin → **"Publish new release"**

### Step 3: Fill Out Publication Form

1. **Plugin Name**: Design Token Export
2. **Tagline**: Export design variables to developer-friendly formats
3. **Description**: Paste your prepared description
4. **Tags**: Select relevant tags
5. **Upload Assets**:
   - Plugin icon (128×128 and 256×256)
   - Cover image (1920×960)
   - Screenshots (3-5 images)
6. **Links**:
   - Website/GitHub URL
   - Support/Documentation URL
7. **Version**: 1.2.0 (from package.json)
8. **Release Notes**: "Initial public release"

### Step 4: Review and Submit

1. Preview how it will look in the Community
2. Check all information is correct
3. Click **"Submit for Review"**

### Step 5: Wait for Approval

- Figma reviews plugins within **1-3 business days**
- You'll receive an email when approved or if changes are needed
- Common rejection reasons:
  - Missing or low-quality assets
  - Bugs or crashes
  - Unclear description
  - Missing required permissions explanation

## 📸 Creating Assets

### Quick Asset Creation Tips

#### Plugin Icon:
```bash
# Use Figma to design your icon:
1. Create 128×128 frame
2. Design simple, recognizable icon
3. Export as PNG
4. Scale up to 256×256 (or design at 256 and scale down)
```

**Icon Ideas**:
- Cube with arrows (export concept)
- Brackets `{}` with color dots
- Variable symbol with download arrow
- Token/coin with code symbol

#### Cover Image:
```bash
1. Create 1920×960 frame in Figma
2. Add screenshot of plugin interface
3. Add example code output
4. Add title text: "Design Token Export"
5. Add key features as bullet points
6. Use your brand colors
7. Export as PNG
```

#### Screenshots:
```bash
1. Open plugin in Figma
2. Use Cmd+Shift+4 (Mac) or Snipping Tool (Windows)
3. Capture:
   - Main interface
   - Export format dropdown
   - Code preview
   - Different export formats
   - Success notification
```

## 🎨 Asset Templates

Create a Figma file with these frames:

```
Plugin Assets
├── Icon 128×128
├── Icon 256×256
├── Cover 1920×960
├── Screenshot 1 - Main Interface
├── Screenshot 2 - Export Formats
├── Screenshot 3 - Code Preview
├── Screenshot 4 - Notifications
└── Screenshot 5 - Multi-format
```

## ✅ Final Checks Before Publishing

- [ ] Plugin works without errors
- [ ] All placeholder text replaced
- [ ] GitHub repository is public (if linking to it)
- [ ] README is complete and accurate
- [ ] All assets are high quality
- [ ] Description is clear and compelling
- [ ] Version number is correct
- [ ] License file exists (MIT)
- [ ] No console errors in production build
- [ ] Tested on both Mac and Windows (if possible)

## 📈 Post-Publication

### After Approval:

1. **Announce it**:
   - Share on Twitter/X
   - Post in design communities
   - Share on LinkedIn
   - Post in Figma Community forums

2. **Monitor feedback**:
   - Check reviews regularly
   - Respond to user questions
   - Fix reported bugs quickly

3. **Iterate**:
   - Gather user feedback
   - Add requested features
   - Publish updates regularly

### Publishing Updates:

```bash
# Update version in package.json
npm version patch  # 1.2.0 → 1.2.1
# or
npm version minor  # 1.2.0 → 1.3.0

# Build
npm run build

# In Figma: Plugins → Development → Right-click → "Publish new version"
```

## 🆘 Troubleshooting

### "Plugin failed to load"
- Check console for errors
- Ensure `code.js` and `ui.html` are in root
- Verify `manifest.json` is valid JSON

### "Assets don't meet requirements"
- Icon must be exactly 128×128 and 256×256
- Cover must be exactly 1920×960
- All images must be PNG or JPG

### "Description too long"
- Figma has character limits
- Keep it concise
- Use bullet points

## 📚 Resources

- [Figma Plugin Documentation](https://www.figma.com/plugin-docs/)
- [Publishing Guidelines](https://www.figma.com/plugin-docs/publishing/)
- [Community Guidelines](https://help.figma.com/hc/en-us/articles/360039958934)
- [Plugin Best Practices](https://www.figma.com/plugin-docs/plugin-best-practices/)

## 🎉 You're Ready!

Once you've completed this checklist, you're ready to publish your plugin to the Figma Community. Good luck! 🚀
