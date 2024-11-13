import * as esbuild from "esbuild";

esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  // platform: "neutral",
  minify: false,
  outfile: "./dist/index.iife.js",
  format: "iife",
});
