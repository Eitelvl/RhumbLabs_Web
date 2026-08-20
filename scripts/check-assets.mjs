import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const canonicalImagesDir = path.join(publicDir, 'images');
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules']);
const textExtensions = new Set([
  '.cjs', '.css', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.ts', '.tsx',
]);
const imageExtensions = new Set([
  '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp',
]);
const rootImageExceptions = new Set(['public/apple-touch-icon.png', 'public/favicon.ico']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    if (entry.isFile()) files.push(absolutePath);
  }

  return files;
}

async function existsWithExactCase(absolutePath) {
  const relativePath = path.relative(root, absolutePath);
  let currentDirectory = root;

  for (const segment of relativePath.split(path.sep)) {
    const entries = await readdir(currentDirectory);
    if (!entries.includes(segment)) return false;
    currentDirectory = path.join(currentDirectory, segment);
  }

  return true;
}

async function hasValidSignature(file) {
  const extension = path.extname(file).toLowerCase();
  const buffer = await readFile(file);

  if (extension === '.png') {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (extension === '.jpg' || extension === '.jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (extension === '.ico') {
    return buffer.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]));
  }
  if (extension === '.gif') {
    return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a';
  }
  if (extension === '.webp') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return buffer.length > 0;
}

const files = await walk(root);
const errors = [];
const referencedRoutes = new Set();
const absoluteAssetPattern = /\/(?:images\/[^\s'"`)]+|favicon\.ico|apple-touch-icon\.png)/g;
const forbiddenPathPattern = /(?:\.\.\/|\.\/)?public\/[^\s'"`)]+|\/static\/[^\s'"`)]+|src\/assets\/[^\s'"`)]+/g;

for (const file of files) {
  const relativeFile = path.relative(root, file);
  if (relativeFile === 'scripts/check-assets.mjs') continue;
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;

  const contents = await readFile(file, 'utf8');

  for (const match of contents.matchAll(absoluteAssetPattern)) {
    const route = match[0].replace(/[?#].*$/, '');
    if (!imageExtensions.has(path.extname(route).toLowerCase())) continue;
    referencedRoutes.add(route);
  }

  for (const match of contents.matchAll(forbiddenPathPattern)) {
    errors.push(`${relativeFile}: ruta de asset no permitida: ${match[0]}`);
  }
}

for (const route of referencedRoutes) {
  const target = path.join(publicDir, route.slice(1));
  if (!await existsWithExactCase(target)) {
    errors.push(`Referencia inexistente o con mayúsculas incorrectas: ${route}`);
    continue;
  }
  if (!await hasValidSignature(target)) {
    errors.push(`Archivo corrupto o con formato incorrecto: ${route}`);
  }
}

const repositoryImages = files.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
for (const image of repositoryImages) {
  const relativeImage = path.relative(root, image).split(path.sep).join('/');
  const isCanonical = image.startsWith(`${canonicalImagesDir}${path.sep}`);
  if (!isCanonical && !rootImageExceptions.has(relativeImage)) {
    errors.push(`Imagen fuera de la ubicación canónica: ${relativeImage}`);
  }
  if (!await hasValidSignature(image)) {
    errors.push(`Imagen corrupta o con formato incorrecto: ${relativeImage}`);
  }
}

const publicImages = repositoryImages.filter((file) => file.startsWith(`${canonicalImagesDir}${path.sep}`));
for (const image of publicImages) {
  const route = `/${path.relative(publicDir, image).split(path.sep).join('/')}`;
  if (!referencedRoutes.has(route)) {
    errors.push(`Imagen sin uso en public/images: ${route}`);
  }
}

if (errors.length > 0) {
  console.error('Asset check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Asset check passed: ${referencedRoutes.size} rutas y ${repositoryImages.length} imágenes verificadas.`);
