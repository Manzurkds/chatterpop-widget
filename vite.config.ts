
import { defineConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Provide a polyfill for process.env.NODE_ENV in the browser
    'process.env.NODE_ENV': JSON.stringify(mode)
  },
  build: {
    lib: mode === 'production' ? {
      entry: path.resolve(__dirname, 'src/standalone-widget.tsx'),
      name: 'ChatterPop',
      fileName: (format) => `chatterpop.${format}.js`,
      formats: ['iife', 'es'],
    } : undefined,
    rollupOptions: mode === 'production' ? {
      output: {
        // Ensure CSS is bundled with the JavaScript
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'chatterpop.css';
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
      },
    } : undefined,
  },
}));
