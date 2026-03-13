/**
 * Utility to get the URL for an asset stored in the public/ directory.
 * @param path - The relative path to the asset (e.g., "hero_background/homebg.webp")
 * @returns The root-relative URL to the asset
 */
export const getAssetUrl = (path: string): string => {
  // Serve all assets from public/ — no R2 dependency
  // Special characters (like '&') in filenames are handled by the browser natively
  // when served as root-relative paths.
  return `/${path}`;
};
