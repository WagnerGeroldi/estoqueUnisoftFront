import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
  },

  build: {
  commonjsOptions: {
    transformMixedEsModules: true,
    include: [/pdfmake/, /node_modules/],
  },
},
optimizeDeps: {
  include: ["pdfmake/build/pdfmake", "pdfmake/build/vfs_fonts"],
},
});


