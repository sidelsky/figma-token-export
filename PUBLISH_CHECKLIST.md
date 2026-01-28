# Quick Publish Checklist ✅

Use this checklist to ensure you're ready to publish.

## Before You Start

- [ ] Plugin works perfectly in Figma
- [ ] No console errors
- [ ] All features tested

## 1. Update Information (5 min)

- [ ] Replace "Your Name" in `package.json` with your actual name
- [ ] Update GitHub URLs in `package.json` and `README.md`
- [ ] Add your email to author field

## 2. Create Assets (30-60 min)

### Required:
- [ ] Plugin icon 128×128px (PNG)
- [ ] Plugin icon 256×256px (PNG)
- [ ] Cover image 1920×960px (PNG/JPG)

### Recommended:
- [ ] 3-5 screenshots showing plugin features

**Tip**: Use Figma to create these! See PUBLISHING_GUIDE.md for templates.

## 3. Build & Test (10 min)

```bash
npm run clean
npm run build
npm run validate
```

- [ ] Build successful
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Test plugin one final time in Figma

## 4. Prepare Description (15 min)

- [ ] Write compelling tagline (60 chars max)
- [ ] Write full description (see PUBLISHING_GUIDE.md for template)
- [ ] Choose 3-5 tags
- [ ] Decide on pricing (recommend: Free)

## 5. Publish (15 min)

1. [ ] Open Figma Desktop App
2. [ ] Go to Plugins → Development → Design Token Export
3. [ ] Right-click → "Publish new release"
4. [ ] Fill out form with prepared content
5. [ ] Upload all assets
6. [ ] Preview and submit

## 6. Wait for Approval (1-3 days)

- [ ] Check email for approval/feedback
- [ ] Make any requested changes
- [ ] Celebrate when approved! 🎉

## Total Time: ~2 hours

Most time is spent creating assets. The actual publishing process is quick!

---

**Need help?** See [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md) for detailed instructions.
