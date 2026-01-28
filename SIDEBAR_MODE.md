# Sidebar vs Modal Mode

The Design Token Export plugin now supports **two display modes**: Sidebar and Modal.

## 🎯 Quick Access

In Figma, go to **Plugins → Design Token Export**:
- **"Open in Sidebar"** - Recommended for most users
- **"Open as Modal"** - Traditional popup window

## 📊 Mode Comparison

| Feature | Sidebar Mode | Modal Mode |
|---------|--------------|------------|
| **Width** | 360px (narrower) | 480px (wider) |
| **Stays Open** | ✅ Yes - while you work | ❌ No - blocks canvas |
| **Resizable** | ✅ User can resize | ❌ Fixed size |
| **Best For** | Ongoing work, quick exports | One-time exports |
| **Canvas Access** | ✅ Full access | ❌ Blocked |

## 🎨 Sidebar Mode (Recommended)

**Advantages:**
- Stays open while you work on designs
- Doesn't block the Figma canvas
- Quick access to export tokens anytime
- Better workflow integration
- Can see design changes and export simultaneously

**When to Use:**
- Working on a design system
- Frequently exporting tokens
- Need to reference tokens while designing
- Multi-tasking workflow

**Dimensions:** 360px wide × 500px tall

## 🪟 Modal Mode

**Advantages:**
- Wider interface (more space for previews)
- Traditional plugin experience
- Focused, distraction-free export

**When to Use:**
- One-time token export
- Need more horizontal space for code preview
- Prefer traditional popup behavior

**Dimensions:** 480px wide × 500px tall

## 💡 Tips

### Sidebar Mode Tips:
1. **Pin it**: Keep the sidebar open while working
2. **Resize**: Drag the edge to make it wider if needed
3. **Floating notifications**: Appear at the bottom, won't block content
4. **Quick export**: Export tokens without interrupting your workflow

### Modal Mode Tips:
1. **More preview space**: Better for reviewing long token lists
2. **Focused work**: No distractions from the canvas
3. **Quick close**: Press ESC or click outside to close

## 🔧 Technical Details

### For Developers:

The mode is determined by which menu command is triggered:

```typescript
// Sidebar (default)
figma.showUI(__html__, { 
  width: 360, 
  height: 500,
  themeColors: true,
  title: 'Design Tokens'
});

// Modal
figma.showUI(__html__, { 
  width: 480, 
  height: 500,
  themeColors: true,
  title: 'Design Token Export'
});
```

### UI Adaptations:

The UI automatically adapts to narrower widths:
- Reduced padding (16px → 12px)
- Smaller notification text (13px → 12px)
- Minimum width: 320px (supports sidebar)
- Responsive layout for buttons and controls

## 🚀 Getting Started

1. **First time?** Try **Sidebar Mode** - it's the modern way to use plugins
2. **Need more space?** Switch to **Modal Mode**
3. **Can't decide?** Use Sidebar for daily work, Modal for presentations

Both modes have the **same features** - just different ways to display them!
