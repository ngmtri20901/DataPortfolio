import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/notion': {
          target: 'https://api.notion.com/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/notion/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Add authentication header
              proxyReq.setHeader('Authorization', `Bearer ${env.NOTION_TOKEN}`);
              proxyReq.setHeader('Notion-Version', '2022-06-28');
            });
          },
        },
      },
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
      // Expose environment variables to the client
      __NOTION_TOKEN__: JSON.stringify(env.NOTION_TOKEN),
      __NOTION_DB_ID__: JSON.stringify(env.VITE_NOTION_DB_ID),
    },
  };
});
