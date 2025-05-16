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

  // Create directory for this variant
  const variantDir = path.join("dist", configName);
  fs.mkdirSync(variantDir, { recursive: true });

  // Read and parse the JSON config
  const configJson = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configJson);

  try {
    // Build a single bundle containing both form and redirect logic
    await esbuild.build({
      entryPoints: ["src/core/ms-form-route.js"],
      bundle: true,
      minify: true,
      sourcemap: true,
      target: "es2015",
      outfile: path.join(variantDir, "form.js"),
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
      legalComments: process.env.NODE_ENV === "production" ? "none" : "inline",
      define: {
        "process.env.CONFIG": JSON.stringify(config),
      },
    });

    console.log(`Built ${configName}/form.js successfully`);
  } catch (error) {
    console.error(`Error building ${configName}:`, error);
    process.exit(1);
  }
});
