import { ASSETS, AssetKey } from '../assets';

/**
 * Returns a robust bundled URL for assets.
 * Uses Vite's native bundled asset pipeline first, guaranteeing reliability across all domains, CDNs and base paths.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Normalize path
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (cleanPath.startsWith('public/')) {
    cleanPath = cleanPath.slice('public/'.length);
  }

  // Check bundled dictionary
  if (cleanPath in ASSETS) {
    return ASSETS[cleanPath as AssetKey];
  }

  // Fallback for subpaths
  const base = import.meta.env.BASE_URL || '/';
  if (base.endsWith('/')) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}
