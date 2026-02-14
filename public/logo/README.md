# Logo Assets Directory

This directory contains all logo and branding assets for TherapyFlow.

## File Structure

```
public/logo/
├── README.md                    # This file
├── logo-horizontal.png          # Full horizontal logo (icon + text)
├── logo-horizontal.svg          # Vector version of horizontal logo
├── logo-icon.png                # Square icon only (512x512px for PWA)
├── logo-icon.svg                # Vector version of icon
├── logo-dark.png                # Dark mode optimized version
├── logo-dark.svg                # Vector dark mode version
├── favicon-32x32.png            # Browser favicon (32x32px)
├── favicon-64x64.png            # Browser favicon (64x64px)
└── favicon.ico                  # Standard favicon format
```

## Logo Specifications

### Colors
- **Primary Blue:** #2563EB (rgb(37, 99, 235))
- **Blue Gradient:** #2563EB to #1D4ED8
- **Purple Accent:** #9333EA (rgb(147, 51, 234))

### Sizes
- **Horizontal Logo:** 1200x400px (recommended)
- **App Icon:** 512x512px (square, for PWA manifest)
- **Favicon:** 32x32px, 64x64px

### Usage Guidelines

1. **Horizontal Logo** (`logo-horizontal.png/svg`)
   - Use in headers, navigation bars
   - Minimum width: 120px
   - Maintain aspect ratio

2. **Icon Only** (`logo-icon.png/svg`)
   - Use for app icons, favicons
   - Use when space is limited
   - Must be square format

3. **Dark Mode Version** (`logo-dark.png/svg`)
   - Use on dark backgrounds
   - Optimized for dark slate (#1E293B) background

## File Formats

- **PNG:** Use for web display, supports transparency
- **SVG:** Use when scalability is needed, smaller file size
- **ICO:** Required for browser favicon compatibility

## How to Add Your Logo

1. Generate your logo using Canva AI with the prompt from `LOGO_DESIGN_PROMPT.md`
2. Export in the following formats:
   - PNG with transparent background (1200x400px for horizontal)
   - PNG with transparent background (512x512px for icon)
   - SVG format for both versions
3. Rename files according to the structure above
4. Place files in this directory (`public/logo/`)
5. Update the PWA manifest (`public/manifest.json`) with icon paths

## PWA Manifest Integration

After adding your logo, update `public/manifest.json`:

```json
{
  "icons": [
    {
      "src": "/logo/logo-icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## Favicon Integration

Update `src/app/layout.tsx` to include favicon:

```tsx
<link rel="icon" href="/logo/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="64x64" href="/logo/favicon-64x64.png" />
```

## Notes

- All logo files should have transparent backgrounds (except favicon.ico)
- Maintain consistent padding/safe area (20% margin recommended)
- Test logos on both light and dark backgrounds
- Ensure logos are legible at small sizes (32px height minimum)
