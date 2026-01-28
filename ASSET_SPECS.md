# Plugin Asset Specifications

Quick reference for creating publication assets.

## 📐 Required Sizes

| Asset | Size | Format | Required |
|-------|------|--------|----------|
| Plugin Icon (Small) | 128×128px | PNG | ✅ Yes |
| Plugin Icon (Large) | 256×256px | PNG | ✅ Yes |
| Cover Image | 1920×960px | PNG/JPG | ✅ Yes |
| Screenshots | 1200×800px+ | PNG/JPG | ⭐ Recommended |

## 🎨 Design Guidelines

### Plugin Icon

**Do:**
- Keep it simple and recognizable
- Use 2-3 colors max
- Make it work at small sizes
- Use transparent background OR solid color
- Center the design

**Don't:**
- Use text (too small to read)
- Use complex gradients
- Make it too detailed
- Use photos

**Icon Ideas:**
```
Option 1: Token Symbol
- Curly braces {} with colored dots inside
- Represents code + design tokens

Option 2: Export Arrow
- Figma logo/square → arrow → code brackets
- Represents export action

Option 3: Variable Symbol
- Dollar sign $ with color swatches
- Represents design variables

Option 4: Design System
- Grid of colored squares with one highlighted
- Represents organized tokens
```

### Cover Image

**Layout:**
```
┌─────────────────────────────────────────┐
│  Title: "Design Token Export"          │
│  Subtitle: "Export variables to code"  │
│                                         │
│  [Screenshot of Plugin UI]             │
│                                         │
│  ✓ 9 Export Formats                    │
│  ✓ W3C Compliant                       │
│  ✓ Multi-Mode Support                  │
└─────────────────────────────────────────┘
```

**Colors:**
- Use your brand colors
- Or use Figma's colors: #0D99FF (blue), #000 (black), #FFF (white)
- Keep it professional and clean

**Include:**
1. Plugin name/title (large, readable)
2. Screenshot of the plugin interface
3. 3-4 key features as bullet points
4. Optional: Example code snippet

### Screenshots

**Recommended shots:**

1. **Main Interface** (1200×800px)
   - Full plugin window
   - Show export format dropdown
   - Show "Generate Design Tokens" button

2. **Export Formats** (1200×800px)
   - Dropdown menu open showing all 9 formats
   - Highlight the variety

3. **Code Preview** (1200×800px)
   - Show generated tokens
   - W3C JSON format recommended
   - Show download/copy buttons

4. **Multiple Formats** (1200×800px)
   - Side-by-side comparison
   - CSS vs JSON vs React Native

5. **Notifications** (1200×800px)
   - Show success notification at bottom
   - Demonstrates the floating notification feature

## 🛠️ Creating Assets in Figma

### Quick Setup:

1. Create new Figma file: "Plugin Assets"
2. Create frames with exact sizes:
   ```
   Icon-128    (128×128)
   Icon-256    (256×256)
   Cover       (1920×960)
   Screenshot1 (1200×800)
   Screenshot2 (1200×800)
   Screenshot3 (1200×800)
   ```

3. Design your assets
4. Export each frame:
   - Select frame
   - Export settings: PNG, 1x
   - Export

### Icon Template (Copy to Figma):

```
Frame: 128×128
Background: Transparent or #0D99FF

Center Element:
- Curly braces: {  }
- Size: 80×80
- Color: White or #000

Inside braces:
- 3 colored circles (tokens)
- Colors: #FF6B6B, #4ECDC4, #FFE66D
- Size: 16×16 each
- Arranged vertically
```

### Cover Template (Copy to Figma):

```
Frame: 1920×960
Background: Linear gradient #0D99FF to #0A7FD9

Layout:
┌──────────────────────────────┐
│ Top 200px:                   │
│   Title (72pt, bold, white)  │
│   Subtitle (32pt, white)     │
│                              │
│ Middle 560px:                │
│   Plugin screenshot          │
│   (centered, drop shadow)    │
│                              │
│ Bottom 200px:                │
│   3 feature bullets          │
│   (24pt, white)              │
└──────────────────────────────┘
```

## 📸 Screenshot Tips

### Taking Screenshots:

**Mac:**
```bash
Cmd + Shift + 4
# Then drag to select area
```

**Windows:**
```bash
Windows + Shift + S
# Then drag to select area
```

### Editing Screenshots:

1. Add subtle drop shadow
2. Add border (1px, light gray)
3. Crop to remove desktop background
4. Ensure text is readable
5. Highlight important UI elements (optional)

## ✅ Quality Checklist

Before exporting:

- [ ] All text is readable at actual size
- [ ] Colors have good contrast
- [ ] No pixelation or blurriness
- [ ] Consistent style across all assets
- [ ] File sizes are reasonable (<5MB each)
- [ ] Exact dimensions match requirements
- [ ] PNG for transparency, JPG for photos

## 📤 Export Settings

**For Icons:**
- Format: PNG
- Scale: 1x (exact pixels)
- Background: Transparent

**For Cover:**
- Format: PNG or JPG
- Scale: 1x
- Quality: 90% (if JPG)

**For Screenshots:**
- Format: PNG
- Scale: 1x
- Include: Drop shadow (optional)

## 🎯 Examples from Popular Plugins

Study these for inspiration:
- "Iconify" - Simple icon design
- "Unsplash" - Clean cover with screenshots
- "Figmotion" - Great use of color
- "Autoflow" - Clear feature demonstration

## 💡 Pro Tips

1. **Keep it simple**: Less is more
2. **Show, don't tell**: Screenshots > descriptions
3. **Brand consistency**: Use same colors throughout
4. **Test at size**: View assets at actual display size
5. **Get feedback**: Ask colleagues before publishing

---

**Ready to create?** Open Figma and start designing! 🎨
