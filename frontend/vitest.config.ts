import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/static/",
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/admin": "http://127.0.0.1:8000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
});