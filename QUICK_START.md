# Quick Start Guide

## TL;DR - What You Need to Know

### The Two Types of Files

| File Type | Where to Edit | Build Needed? | What It Does |
|-----------|---------------|---------------|--------------|
| **UI** | `ui.html` (root) | ❌ No | The plugin interface (5000+ lines) |
| **Plugin Logic** | `src/code.ts` | ✅ Yes | Backend logic that talks to Figma |

## Making Changes

### 🎨 Changing the UI (Most Common)

```bash
# 1. Open ui.html in your editor
code ui.html

# 2. Make your changes
# 3. Save
# 4. Reload plugin in Figma (no build needed!)
```

### ⚙️ Changing Plugin Logic

```bash
# 1. Edit the TypeScript
code src/code.ts

# 2. Build
npm run build

# 3. Reload plugin in Figma
```

## Common Tasks

### Adding a New Export Format
1. Edit `ui.html` - add UI option
2. Edit `ui.html` - add conversion function in `<script>` section
3. Test in Figma

### Fixing a Bug in Token Extraction
1. Edit `src/code.ts`
2. Run `npm run build`
3. Test in Figma

### Styling Changes
1. Edit CSS in `ui.html` (find `<style>` tag ~line 7)
2. Save and reload

## File Map

```
📁 figma-token-export/
├── 📝 ui.html          ← EDIT THIS for all UI changes
├── 📝 ui.js            ← Supporting UI file (rarely edited)
├── 🔧 code.js          ← Built automatically (don't edit)
├── 📁 src/
│   └── 📝 code.ts      ← EDIT THIS for plugin logic
└── 📁 dist/
    └── 🔧 code.js      ← Built automatically (don't edit)
```

## Testing

```bash
# In Figma:
# Cmd/Ctrl + Alt + P → "Design Token Export"

# Or just:
# Plugins → Development → Design Token Export
```

## Before Committing

```bash
npm run validate   # Checks types and linting
git status         # Make sure you edited the right files!
```

## Getting Help

- 📖 Full details: See [ARCHITECTURE.md](ARCHITECTURE.md)
- 🐛 Issues: Check [GitHub Issues](https://github.com/yourusername/figma-token-export/issues)
- 📚 README: See [README.md](README.md)

## Pro Tips

1. **Use browser DevTools** - Right-click in plugin → Inspect to debug UI
2. **Console logs work** - Use `console.log()` in both `ui.html` and `src/code.ts`
3. **Hot reload** - Just close and reopen plugin to see changes
4. **Watch mode exists** - `npm run dev` watches TypeScript files (but doesn't auto-copy)
