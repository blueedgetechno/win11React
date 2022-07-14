import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
    return defineConfig({
        plugins: [react()],
        define: {
            "process.env.NODE_ENV": `"${mode}"`,
        }
    })
}