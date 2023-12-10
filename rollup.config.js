import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const config = {
  input: "main.ts",
  output: {
    file: "dist/main.mjs",
    format: "es",
  },
  plugins: [typescript(), terser()],
};
export default config;
