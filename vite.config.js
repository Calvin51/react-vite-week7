import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  //加入開發中(dev)、產品路徑(build)
  base: process.env.NODE_ENV === "production" ? "/react-vite-week7/" : "/",
  plugins: [react()],
});
