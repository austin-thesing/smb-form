const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const rimraf = require("rimraf");

// Clean dist directory
rimraf.sync("dist");
fs.mkdirSync("dist", { recursive: true });

// Get all config directories
const configsDir = path.join(__dirname, "src/configs");
const configs = fs.readdirSync(configsDir).filter((file) => fs.statSync(path.join(configsDir, file)).isDirectory());

// Build for each config
configs.forEach(async (configName) => {
  const configPath = path.join(configsDir, configName, "config.json");

  // Skip if no config file exists
  if (!fs.existsSync(configPath)) {
    console.log(`Skipping ${configName} - no config.json found`);
    return;
  }

  // Create directory for this variant in dist
  const variantDir = path.join("dist", configName);
  fs.mkdirSync(variantDir, { recursive: true });

  // Read and parse the JSON config
  const configJson = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configJson);

  const commonEsbuildOptions = {
    entryPoints: ["src/core/ms-form-route.js"],
    bundle: true,
    target: "es2015",
    define: {
      "process.env.CONFIG": JSON.stringify(config),
    },
  };

  try {
    // Build production version
    await esbuild.build({
      ...commonEsbuildOptions,
      define: {
        ...commonEsbuildOptions.define,
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      minify: true,
      sourcemap: true,
      outfile: path.join(variantDir, "form.js"),
      drop: ["console", "debugger"], // Always drop for prod build
      legalComments: "none",
    });
    console.log(`Built ${configName}/form.js (production) successfully`);

    // Build debug version
    const debugOutfilePath = path.join(configsDir, configName, "debug-form.js");
    await esbuild.build({
      ...commonEsbuildOptions,
      define: {
        ...commonEsbuildOptions.define,
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      minify: false, // Keep readable
      sourcemap: "inline", // Inline sourcemap for easier debugging
      outfile: debugOutfilePath,
      drop: [], // Keep console logs
      legalComments: "inline",
    });
    console.log(`Built ${configName}/debug-form.js (debug) successfully`);
  } catch (error) {
    console.error(`Error building ${configName}:`, error);
    process.exit(1);
  }
});
