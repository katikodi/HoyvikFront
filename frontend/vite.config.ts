import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [
            tanstackRouter({
                target: "react",
                autoCodeSplitting: true
            }),
            react(),
            tailwindcss(),
            babel({ presets: [reactCompilerPreset()] })
        ],
        server: {
            port: 54131,
            proxy: {
                // Proxy API calls to the app service
                "/api": {
                    target: env.services__backend__https__0 || process.env.services__backend__http__0,
                    changeOrigin: false,
                    secure: false
                },
                "/content": {
                    target: env.services__backend__https__0 || process.env.services__backend__http__0,
                    changeOrigin: false,
                    secure: false
                }
            }
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            }
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: "./src/unitTests/setupTests.js"
        }
    };
});

// import path from "path";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//     plugins: [react(), tailwindcss()],
//     resolve: {
//         alias: {
//             "@": path.resolve(import.meta.dirname, "./src")
//         }
//     }
// });
