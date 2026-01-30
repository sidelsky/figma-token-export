# Tailwind Export - Nested Structure

## Before (Flat Strings) ❌

The old implementation flattened everything:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'colors-primary': '#3b82f6',
        'colors-secondary': '#8b5cf6',
        'colors-primary-500': '#3b82f6',
        'colors-primary-600': '#2563eb',
        'colors-gray-100': '#f3f4f6',
        'colors-gray-200': '#e5e7eb',
      },
      spacing: {
        'spacing-xs': '4px',
        'spacing-sm': '8px',
        'spacing-md': '16px',
        'spacing-lg': '24px',
      },
    },
  },
}
```

**Problem**: This creates flat class names like `bg-colors-primary-500` which is not how Tailwind is designed to work!

## After (Nested Objects) ✅

The new implementation creates proper nested structures:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
        secondary: '#8b5cf6',
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
    },
  },
}
```

**Benefits**:
- ✅ Uses native Tailwind class names: `bg-primary-500` instead of `bg-colors-primary-500`
- ✅ Follows Tailwind conventions for color scales (100-900)
- ✅ Cleaner, more maintainable structure
- ✅ Works seamlessly with Tailwind's IntelliSense
- ✅ Supports arbitrary nesting depth

## How It Works

The export now parses token names intelligently:

- `primary-500` → `{ primary: { 500: '#...' } }`
- `text/heading/large` → `{ text: { heading: { large: '...' } } }`
- `spacing-md` → `{ spacing: { md: '...' } }`

Token names are split by `/`, `-`, or `_` separators to create the nested structure.

## Usage Example

```jsx
// With nested structure:
<div className="bg-primary-500 text-white p-md">
  <h1 className="text-heading-xl font-bold">Hello World</h1>
</div>

// Instead of the old flat way:
<div className="bg-colors-primary-500 text-colors-white p-spacing-md">
  <h1 className="text-typography-heading-large font-weight-bold">Hello World</h1>
</div>
```

## Supported Categories

The export automatically categorizes tokens into Tailwind's theme sections:

- **colors** - Color tokens
- **spacing** - Spacing, padding, margin, gap values
- **fontSize** - Font size values
- **fontWeight** - Font weight values
- **lineHeight** - Line height values
- **letterSpacing** - Letter spacing values
- **fontFamily** - Font family strings
- **borderRadius** - Border radius values
