# Flame Font Files

This folder should contain the following font files for the **Flame** font family:

## Required Files:

- `Flame-Regular.woff2` - Regular weight (400) in WOFF2 format
- `Flame-Regular.woff` - Regular weight (400) in WOFF format (fallback)
- `Flame-Bold.woff2` - Bold weight (700) in WOFF2 format (optional)
- `Flame-Bold.woff` - Bold weight (700) in WOFF format (optional fallback)

## How to Add Font Files:

1. Obtain the Flame font files (WOFF2 and WOFF formats)
2. If you have TTF files, convert them to WOFF/WOFF2 using an online converter or tool like:
   - https://cloudconvert.com/ttf-to-woff2
   - https://www.fontsquirrel.com/tools/webfont-generator
3. Place them in this `src/assets/fonts/flame/` directory
4. Ensure the filenames match exactly as listed above
5. The fonts will be automatically loaded by the application

## Font Loading:

The fonts are defined in `src/styles/flame-font.css` and imported via `src/main.tsx`.

If font files are missing, the browser will fall back to system fonts as defined in `src/styles/variables.css`.

## Notes:

- WOFF2 is the preferred format (better compression)
- WOFF is provided as a fallback for older browsers
- The font uses `font-display: swap` for better performance

