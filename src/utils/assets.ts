import { ASSETS, AssetKey } from '../assets';

/**
 * Normalizes an asset key to clean relative format (e.g. 'rhumb-labs-logo.png' or 'pogo/pogo-logo.png')
 */
export function normalizeAssetKey(path: string): string {
  if (!path) return '';
  let clean = path;
  if (clean.includes('?')) clean = clean.split('?')[0];
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  clean = clean.replace(/^(\.\/|\/)/, '');
  if (clean.startsWith('src/assets/')) clean = clean.slice('src/assets/'.length);
  if (clean.startsWith('public/')) clean = clean.slice('public/'.length);
  if (clean.startsWith('@fs/')) {
    const parts = clean.split('src/assets/');
    if (parts.length > 1) clean = parts[1];
  }
  return clean;
}

/**
 * Returns a robust URL for assets.
 * Uses Vite's native bundled asset pipeline first, guaranteeing reliability across all domains, CDNs and base paths.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = normalizeAssetKey(path);

  // Check bundled dictionary first
  if (cleanPath in ASSETS) {
    return ASSETS[cleanPath as AssetKey];
  }

  // Fallback to static root path
  const base = import.meta.env.BASE_URL || '/';
  if (base.endsWith('/')) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}

/**
 * Returns a secondary fallback URL for assets (direct public static route) if the bundled URL fails.
 */
export function getFallbackAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = normalizeAssetKey(path);
  return `/${cleanPath}`;
}

