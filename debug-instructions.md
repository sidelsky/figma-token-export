# Manual Debug Steps

## 1. Plugin Loading Test
- [ ] Import main plugin (manifest.json)
- [ ] Plugin appears in menu as "Export Design Tokens"
- [ ] Clicking menu item opens a window
- [ ] Window shows title "Design Token Export"
- [ ] Blue button visible saying "Export Design Tokens"

## 2. Console Check
- [ ] Right-click in plugin window → Inspect
- [ ] Console tab open
- [ ] See message: "HTML loaded, about to load ui.js"
- [ ] See message: "DOM loaded, initializing plugin UI..."
- [ ] See message: "All DOM elements found, setting up event listeners..."

## 3. Button Click Test  
- [ ] Click "Export Design Tokens" button
- [ ] Button text changes to "Exporting..."
- [ ] Button becomes disabled (grayed out)
- [ ] Status message appears: "Extracting design tokens..."
- [ ] Console shows: "Export button clicked!"
- [ ] Console shows: "Starting export process..."
- [ ] Console shows: "Sending message to plugin code..."

## 4. Figma Variables Check
- [ ] File has local variables (not library variables)
- [ ] Variables panel shows at least one collection
- [ ] Variables have values set

## 5. Expected Success
- [ ] Console shows: "Plugin received message: {type: 'export-tokens'}"
- [ ] Console shows: "Getting variable collections..."
- [ ] Console shows: "Found X collections: [names]"
- [ ] Status changes to green: "Successfully extracted X collection(s)!"
- [ ] Preview section appears with JSON data
- [ ] Download and Copy buttons become available

## Troubleshooting by Symptom

### Nothing happens when clicking Export
**Likely cause**: JavaScript not loading
**Check**: Console for error messages, ensure ui.js exists

### Button changes but no success message
**Likely cause**: No variables in file or plugin communication issue
**Check**: Create test variables, check console for "Found 0 collections"

### Plugin window doesn't open
**Likely cause**: Manifest or file path issue
**Check**: Verify manifest.json, code.js, ui.html exist

### "Export button not found!" in console
**Likely cause**: HTML structure issue
**Check**: Verify ui.html has element with id="exportBtn" 