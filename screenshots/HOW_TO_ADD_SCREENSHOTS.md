# How to Add Screenshots to README

## Required Screenshots (3 total)

You need to take 3 screenshots from your **deployed application** (not localhost):
- **Deployed URL:** https://spend-lens-jpbqm82oo-ritams-projects-83d26bdd.vercel.app

### Screenshot 1: Landing Page
- **URL:** https://spend-lens-jpbqm82oo-ritams-projects-83d26bdd.vercel.app
- **What to capture:** Full landing page showing hero section with headline "Audit your AI stack instantly"
- **Save as:** `screenshots/landing.png`

### Screenshot 2: Audit Form
- **URL:** https://spend-lens-jpbqm82oo-ritams-projects-83d26bdd.vercel.app/audit
- **What to capture:** The audit form with multi-tool input fields
- **Save as:** `screenshots/audit-form.png`

### Screenshot 3: Results Page
- **URL:** Complete an audit first, then screenshot the results page
- **What to capture:** Results page showing savings breakdown and recommendations
- **Save as:** `screenshots/results.png`

## How to Take Screenshots

### Option 1: Windows Snipping Tool (Recommended)
1. Press `Windows + Shift + S`
2. Select area to capture
3. Screenshot is copied to clipboard
4. Open Paint or any image editor
5. Paste (Ctrl+V) and save as PNG in `screenshots/` folder

### Option 2: Browser DevTools (Full Page)
1. Open Chrome/Edge DevTools (F12)
2. Press `Ctrl + Shift + P` (Command Palette)
3. Type "screenshot" and select "Capture full size screenshot"
4. Save to `screenshots/` folder

### Option 3: Browser Extension
- Use "GoFullPage" or "Awesome Screenshot" extension
- Capture full page screenshot
- Save to `screenshots/` folder

## After Taking Screenshots

1. Verify all 3 files exist:
   - `screenshots/landing.png`
   - `screenshots/audit-form.png`
   - `screenshots/results.png`

2. The README.md already has the correct paths configured:
   ```markdown
   ![Landing Page](./screenshots/landing.png)
   ![Audit Form](./screenshots/audit-form.png)
   ![Results Page](./screenshots/results.png)
   ```

3. Commit and push:
   ```bash
   git add screenshots/
   git commit -m "Add application screenshots"
   git push
   ```

## Screenshot Quality Tips

- **Resolution:** At least 1920x1080 (Full HD)
- **Format:** PNG (better quality than JPG)
- **Size:** Keep under 2MB per image (GitHub limit is 10MB)
- **Content:** Make sure text is readable
- **Browser:** Use Chrome/Edge for best rendering
- **Zoom:** 100% zoom level (not zoomed in/out)

## Verification

After pushing, verify screenshots appear correctly on GitHub:
1. Go to https://github.com/ritamm-018/SpendLens
2. Scroll down to README
3. Check that all 3 screenshots are visible

## Alternative: Use Demo Video Instead

If screenshots are difficult, you can use a 30-second demo video instead:
- Record screen using Windows Game Bar (Windows + G)
- Upload to YouTube/Loom as unlisted
- Replace screenshot section in README with video embed

But **screenshots are preferred** by Credex assignment requirements.
