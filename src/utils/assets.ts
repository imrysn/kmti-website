
/**
 * Utility to get the full URL for an asset stored in Cloudflare R2.
 * @param path - The relative path to the asset (e.g., "hero_background/homebg.jpeg")
 * @returns The full URL to the asset
 */
export const getAssetUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_ASSETS_URL;

  if (!baseUrl) {
    console.warn("VITE_ASSETS_URL is not defined in .env. using local assets as fallback (which will likely fail if files are deleted).");
    return path;
  }

  // Ensure no double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBase}/${cleanPath}`;
};
