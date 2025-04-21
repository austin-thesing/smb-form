# SMB Form

A form integration solution for small and medium businesses (SMB) with HubSpot integration capabilities.

## Overview

This project provides a form routing solution that integrates with HubSpot, allowing businesses to collect and process form submissions efficiently. The main entry point is `ms-form-route.js` which handles form submissions and routing.

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

## Installation

```bash
# Install dependencies
npm install
```

## Development

The project uses esbuild for bundling and provides several npm scripts for development:

```bash
# Start development watch mode
npm run watch

# Build for development
npm run build

# Build for production
npm run build:prod
```

### Build Scripts

- `build`: Creates a development build with source maps
- `build:prod`: Creates a minified production build with external source maps and removes console logs
- `watch`: Watches for changes and rebuilds automatically (production settings)

## Project Structure

```
smb-form/
├── dist/           # Compiled output
├── ms-form-route.js # Main entry point
└── package.json    # Project configuration and dependencies
```

## Dependencies

### Development Dependencies

- `cross-env`: ^7.0.3 - Cross-platform environment variable setting
- `esbuild`: ^0.20.1 - Fast JavaScript bundler
- `nodemon`: ^3.1.0 - Development auto-reloader
- `prettier`: ^3.5.3 - Code formatter
- `rimraf`: ^5.0.5 - Cross-platform file removal utility

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]
