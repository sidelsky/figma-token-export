# Analytics Tab Architecture

## Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ANALYTICS TAB                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         OVERVIEW STATISTICS                         │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Total Tokens │  │ Collections  │               │    │
│  │  │     18       │  │      3       │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         INSERTION ANALYTICS                         │    │
│  │  ┌──────────┬──────────────┬────────────────┐     │    │
│  │  │  Styles  │  Components  │  Variables     │     │    │
│  │  └──────────┴──────────────┴────────────────┘     │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────┐      │    │
│  │  │      Area Chart (SVG)                   │      │    │
│  │  │  ╱╲                                      │      │    │
│  │  │ ╱  ╲╱╲    ╱╲                            │      │    │
│  │  │      ╲  ╱  ╲  ╱╲                        │      │    │
│  │  │       ╲╱    ╲╱  ╲                       │      │    │
│  │  │  [30d] [60d] [90d] [1y]                 │      │    │
│  │  └─────────────────────────────────────────┘      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ▼ Token Types Distribution                        │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ▼ Color Samples                                   │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ▼ Number/Spacing Samples                          │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ▼ Collections Breakdown                           │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │     [Export Analytics to CSV]                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌───────────────────┐
│   Plugin Init     │
└─────────┬─────────┘
          │
          ▼
┌─────────────────────────┐
│ initializeSampleData()  │
└─────────┬───────────────┘
          │
          ▼
┌──────────────────────────┐
│ generateSampleTokenData()│
│                          │
│ Returns:                 │
│ • metadata               │
│ • collections {          │
│     colors: {...}        │
│     spacing: {...}       │
│     typography: {...}    │
│   }                      │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────┐
│ updateAnalytics(data)│
└─────────┬────────────┘
          │
          ▼
┌──────────────────────────┐
│  generateStatistics(data)│
│                          │
│  Calculates:             │
│  • totalTokens           │
│  • totalCollections      │
│  • typeBreakdown         │
│  • collectionBreakdown   │
│  • colorSamples          │
│  • numberSamples         │
│  • insertionData         │
│  • accessibilityAnalysis │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│ createAnalyticsHTML(stats)│
│                          │
│ Generates:               │
│ • Overview cards         │
│ • Sub-tab navigation     │
│ • Area charts (3x)       │
│ • Collapsible sections   │
│ • Sample grids           │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│   Update DOM             │
│   analyticsContent.      │
│   innerHTML = html       │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│ Attach Event Listeners   │
│                          │
│ • Toggle buttons         │
│ • Chart tooltips         │
│ • Copy buttons           │
│ • Time period selectors  │
└──────────────────────────┘
```

## User Export Flow

```
┌─────────────────────┐
│ User Clicks         │
│ "Generate Tokens"   │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│ Plugin Code Extracts │
│ Figma Variables      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Send Message to UI:  │
│ type: 'tokens-       │
│       extracted'     │
│ data: ExportData     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ handleTokensExtracted│
│ (data)               │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ updateAnalytics(data)│
│                      │
│ (Same flow as init)  │
└──────────────────────┘
```

## CSV Export Flow

```
┌─────────────────────┐
│ User Clicks         │
│ "Export Analytics   │
│  to CSV"            │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│ handleAnalyticsExport│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ generateCSVData(     │
│   analyticsStats)    │
│                      │
│ Creates CSV string:  │
│ • Overview           │
│ • Type breakdown     │
│ • Collections        │
│ • Color samples      │
│ • Number samples     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ downloadFile(        │
│   csvData,           │
│   'text/csv',        │
│   filename)          │
│                      │
│ • Create Blob        │
│ • Create download    │
│   link               │
│ • Trigger download   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Show Success Message │
│ "Analytics exported  │
│  to CSV successfully"│
└──────────────────────┘
```

## Insertion Analytics Sub-system

```
┌────────────────────────────────────────┐
│         Insertion Analytics            │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Sub-tab Navigation          │ │
│  │  [Styles] [Components] [Variables]│ │
│  └────────────┬─────────────────────┘ │
│               │                        │
│               ▼                        │
│  ┌──────────────────────────────────┐ │
│  │   switchInsertionTab(tabName)    │ │
│  │   • Hide all charts              │ │
│  │   • Show selected chart          │ │
│  │   • Update active tab styling    │ │
│  │   • Initialize tooltips          │ │
│  └────────────┬─────────────────────┘ │
│               │                        │
│               ▼                        │
│  ┌──────────────────────────────────┐ │
│  │      Display Chart Content       │ │
│  │  ┌────────────────────────────┐  │ │
│  │  │  Area Chart (SVG)          │  │ │
│  │  │  • Line path               │  │ │
│  │  │  • Gradient fill           │  │ │
│  │  │  • Data points             │  │ │
│  │  │  • X/Y axes                │  │ │
│  │  │  • Time period buttons     │  │ │
│  │  └────────────────────────────┘  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   Time Period Selector           │ │
│  │   [30d] [60d] [90d] [1y]         │ │
│  └────────────┬─────────────────────┘ │
│               │                        │
│               ▼                        │
│  ┌──────────────────────────────────┐ │
│  │ handleTimePeriodChange(type,     │ │
│  │                        period)    │ │
│  │ • Store new period               │ │
│  │ • Regenerate data                │ │
│  │ • Recreate chart                 │ │
│  │ • Update tooltips                │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

## Chart Generation Process

```
┌───────────────────────────────┐
│ createAreaChart(              │
│   data,                       │
│   type,                       │
│   containerId,                │
│   period                      │
│ )                             │
└────────────┬──────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Define Chart Dimensions      │
│ • width: 600px               │
│ • height: 220px              │
│ • margins                    │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Calculate Scales             │
│ • xScale (date → x position) │
│ • yScale (value → y position)│
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Generate SVG Elements        │
│ • <defs> for gradient        │
│ • <path> for area fill       │
│ • <path> for line            │
│ • <circle> for data points   │
│ • <g> for axes               │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Add Interactive Elements     │
│ • Tooltip div                │
│ • Hover event listeners      │
│ • Time period buttons        │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Return HTML String           │
│ (Complete chart markup)      │
└──────────────────────────────┘
```

## Collapsible Section System

```
┌────────────────────────────────┐
│  Collapsible Section          │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │  Header (clickable)       │ │
│  │  ▼ Token Types Distribution│ │
│  └────────┬─────────────────┘ │
│           │ onclick           │
│           ▼                   │
│  ┌──────────────────────────┐ │
│  │ toggleSection('types')    │ │
│  │ • Get content element     │ │
│  │ • Get toggle button       │ │
│  │ • Toggle 'hidden' class   │ │
│  │ • Toggle 'expanded' class │ │
│  │ • Rotate icon             │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │  Content (collapsible)    │ │
│  │  ┌────────────────────┐  │ │
│  │  │ Bar Chart / Grid   │  │ │
│  │  └────────────────────┘  │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

## State Management

```javascript
// Global State Variables
┌─────────────────────────────────┐
│ let analyticsStats = null;      │  // Current analytics data
│                                  │
│ let currentTimePeriods = {      │  // Selected time periods
│   'styles': '30days',           │
│   'components': '30days',       │
│   'variables': '30days'         │
│ };                              │
│                                  │
│ let collapsedSections = {       │  // Section visibility
│   'types': false,               │
│   'colors': false,              │
│   'numbers': false,             │
│   'collections': false          │
│ };                              │
└─────────────────────────────────┘
```

## Key Functions Map

```
Analytics Core
├── updateAnalytics(data)              // Main update function
├── generateStatistics(data)           // Process token data
└── createAnalyticsHTML(stats)         // Generate HTML

Chart System
├── createAreaChart(...)               // Create SVG chart
├── generateInsertionData(period)      // Generate time-series data
├── initializeAreaChartTooltips(id)    // Setup tooltips
└── handleTimePeriodChange(type, p)    // Update time period

Export System
├── handleAnalyticsExport()            // Export to CSV
└── generateCSVData(stats)             // Convert to CSV format

Interaction System
├── switchInsertionTab(tabName)        // Switch chart tabs
├── toggleSection(sectionId)           // Expand/collapse sections
├── copyToClipboard(text, btn)         // Copy functionality
└── showCopyFeedback(btn, success)     // Visual feedback

Utility Functions
├── createBarChart(data)               // Type distribution chart
├── formatDateLabel(date)              // Date formatting
├── getTypeLabel(type)                 // Type name mapping
└── escapeForAttribute(text)           // HTML escaping
```

## Event Listener Registration

```
On DOM Ready
├── Tab Button Click
│   └─> switchTab('analytics')
│
├── Export Analytics Button Click
│   └─> handleAnalyticsExport()
│
├── Sub-tab Buttons Click (inline onclick)
│   └─> switchInsertionTab(type)
│
├── Section Headers Click (inline onclick)
│   └─> toggleSection(sectionId)
│
├── Copy Buttons Click (inline onclick)
│   └─> copyToClipboard(value, btn)
│
└── Time Period Buttons Click (inline onclick)
    └─> handleTimePeriodChange(type, period)

After HTML Insertion
├── Toggle Buttons Click (via setTimeout)
│   └─> toggleSection(sectionId)
│
└── Chart Point Hover (via initializeAreaChartTooltips)
    ├─> mouseenter: show tooltip
    └─> mouseleave: hide tooltip
```

## CSS Architecture

```
Styles
├── .analytics-sub-nav
│   └── Sub-tab navigation container
├── .analytics-sub-tab
│   ├── .active (selected state)
│   └── :hover (hover state)
├── .insertion-charts
│   └── Chart container
├── .insertion-chart-content
│   ├── .hidden (collapsed state)
│   └── visible (expanded state)
├── .collapsible-header
│   └── Clickable section headers
├── .toggle-btn
│   ├── .expanded (rotated icon)
│   └── default (right-pointing icon)
├── .area-chart
│   ├── SVG container
│   └── responsive sizing
└── .copy-tooltip
    ├── .show (visible)
    └── default (hidden)
```

## Data Structure

```typescript
interface AnalyticsStats {
  totalTokens: number;
  totalCollections: number;
  typeBreakdown: Record<string, number>;
  collectionBreakdown: Record<string, {
    name: string;
    count: number;
    modes: Array<{name: string, id: string}>;
  }>;
  colorSamples: Array<{name: string, value: string}>;
  numberSamples: Array<{name: string, value: number}>;
  insertionData: {
    styles: Array<{date: string, value: number, label: string}>;
    components: Array<{date: string, value: number, label: string}>;
    variables: Array<{date: string, value: number, label: string}>;
  };
  accessibilityAnalysis: any;
  exportedAt: string;
}
```

## Performance Considerations

```
Optimizations
├── Lazy DOM Updates
│   └── Only update when data changes
├── Event Delegation
│   └── Minimal event listeners
├── SVG Generation
│   └── String concatenation (fast)
├── Collapsible Sections
│   └── Start collapsed (faster initial render)
└── Sample Data Limits
    ├── Max 8 color samples
    └── Max 8 number samples
```

## Error Handling

```
Error Points
├── updateAnalytics(data)
│   └── Check if analyticsContent exists
├── generateStatistics(data)
│   └── Validate data structure
├── handleAnalyticsExport()
│   └── Try-catch with error status message
├── copyToClipboard(text, btn)
│   ├── Check Clipboard API availability
│   └── Fallback to document.execCommand
└── initializeAreaChartTooltips(id)
    └── Check if chart and tooltip exist
```

---

**Architecture designed for:**
- ✅ Maintainability
- ✅ Performance
- ✅ Scalability
- ✅ User Experience
- ✅ Error Resilience
