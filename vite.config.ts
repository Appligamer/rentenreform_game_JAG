import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

function collectArtworks(rootDir: string): string[] {
  const artworksDir = path.join(rootDir, 'artworks');
  if (!fs.existsSync(artworksDir)) return [];
  const results: string[] = [];

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          const rel = path.relative(rootDir, full).replace(/\\/g, '/');
          results.push(rel);
        }
      }
    }
  };

  walk(artworksDir);
  return results.sort();
}

function artworksManifestPlugin(rootDir: string): Plugin {
  const virtualId = 'virtual:available-artworks';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'artworks-manifest',
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        const list = collectArtworks(rootDir);
        return `export const AVAILABLE_ARTWORKS = ${JSON.stringify(list)};`;
      }
    },
    configureServer(server) {
      const artworksDir = path.join(rootDir, 'artworks');
      server.middlewares.use('/artworks', (req, res, next) => {
        const reqUrl = (req.url || '').split('?')[0].replace(/^\/+/, '');
        if (!reqUrl) return next();
        const filePath = path.resolve(artworksDir, reqUrl);
        if (!filePath.startsWith(artworksDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next();
        }
        const ext = path.extname(filePath).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) return next();
        const mimeMap: Record<string, string> = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
        };
        res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
      });
    },
    closeBundle() {
      const distArtworks = path.join(rootDir, 'web', 'dist', 'artworks');
      const list = collectArtworks(rootDir);
      if (list.length === 0) return;
      for (const rel of list) {
        const src = path.join(rootDir, rel);
        const dest = path.join(rootDir, 'web', 'dist', rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
      if (!fs.existsSync(distArtworks)) {
        fs.mkdirSync(distArtworks, { recursive: true });
      }
    },
  };
}

export default defineConfig(() => {
  const rootDir = import.meta.dirname;
  return {
    base: './',
    publicDir: false as const,
    plugins: [react(), tailwindcss(), artworksManifestPlugin(rootDir)],
    build: {
      outDir: 'web/dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'web'),
      },
    },
    server: {
      // Optional: HMR per Umgebungsvariable DISABLE_HMR=true deaktivieren
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
