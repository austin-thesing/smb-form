# Multi-Form Build System

This project allows building multiple versions of forms with different configurations while maintaining a single source of core logic.

## Project Structure

```
src/
  core/               # Core form logic
    ms-form-route.js  # Main form handling logic
    ecommerce-redirect.js
  configs/            # Form configurations
    smb-form/         # SMB form configuration
      config.json
    other-form/       # Other form configurations
      config.json
```

## Configuration

Each form version needs a configuration file (`config.json`) in its directory under `src/configs/`. The configuration file should contain:

```json
{
  "webflowFormId": "YOUR_WEBFLOW_FORM_ID",
  "hubspotFormId": "YOUR_HUBSPOT_FORM_ID",
  "redirectBaseUrl": "YOUR_REDIRECT_BASE_URL",
  "formName": "form-name"
}
```

## Building

The build system will create separate builds for each configuration in the `dist` directory:

```
dist/
  smb-form/
    ms-form-route.js
  other-form/
    ms-form-route.js
```

### Commands

- `npm run build` - Development build
- `npm run build:prod` - Production build (minified, no console logs)
- `npm run watch` - Watch mode for development

## Adding a New Form

1. Create a new directory under `src/configs/` with your form name
2. Add a `config.json` file with your form's configuration
3. Run the build command

The build system will automatically create a new build for your form in the `dist` directory.
