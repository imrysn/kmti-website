# Font Files

This folder should contain the following font files for the **Flame** font family:

## Required Files:

- `Flame-Regular.woff2` - Regular weight (400) in WOFF2 format
- `Flame-Regular.woff` - Regular weight (400) in WOFF format (fallback)
- `Flame-Bold.woff2` - Bold weight (700) in WOFF2 format
- `Flame-Bold.woff` - Bold weight (700) in WOFF format (fallback)

## How to Add Font Files:

1. Obtain the Flame font files (WOFF2 and WOFF formats)
2. Place them in this `src/assets/fonts/` directory
3. Ensure the filenames match exactly as listed above
4. The fonts will be automatically loaded by the application

## Font Loading:

The fonts are defined in `src/styles/flame-font.css` and imported via `src/main.tsx`.

If font files are missing, the browser will fall back to system fonts as defined in `src/styles/variables.css`.

## Note:

Font files should be placed in the `src/assets/fonts/flame/` subdirectory.

