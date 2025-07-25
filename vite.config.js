import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import svgr from 'vite-plugin-svgr';
// Load .env variables manually
dotenv.config();

const host = process.env.VITE_HOSTNAME || 'localhost';
const port = parseInt(process.env.VITE_PORT) || 5173;

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server:{
    host:true,
    port
  }
})
