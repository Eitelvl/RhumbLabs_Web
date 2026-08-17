/**
 * Utility to resolve static image assets centralized in /images/
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/images/')) {
    return path;
  }
  let clean = path.replace(/^(\.\/|\/)/, '');
  if (clean.startsWith('public/')) clean = clean.slice('public/'.length);
  if (clean.startsWith('src/assets/')) clean = clean.slice('src/assets/'.length);
  if (clean.startsWith('images/')) clean = clean.slice('images/'.length);
  if (clean.startsWith('pogo/')) clean = clean.slice('pogo/'.length);
  
  return `/images/${clean}`;
}

export function normalizeAssetKey(path: string): string {
  if (!path) return '';
  let clean = path.replace(/^(\.\/|\/)/, '');
  if (clean.startsWith('public/')) clean = clean.slice('public/'.length);
  if (clean.startsWith('src/assets/')) clean = clean.slice('src/assets/'.length);
  return clean;
}

export function getFallbackAssetUrl(path: string): string {
  return getAssetUrl(path);
}
