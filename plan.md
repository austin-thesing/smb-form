# E-commerce Seller Redirect Feature Plan

## Goal

Implement a feature where users who identify as e-commerce sellers ("Yes" to the relevant question) are immediately redirected to `https://app.onrampfunds.com/smb-signup` with specific form values appended as URL parameters. Users selecting "No" should proceed with the standard form flow.

## Implementation Steps

1.  **Code Organization:**

    - Create a new directory `src/` for source JavaScript files if it doesn't exist.
    - Create a new file `src/ecommerce-redirect.js` to contain the logic specifically for handling the e-commerce seller redirect.
    - Keep existing form logic (HubSpot integration, general validation, multi-step handling) in `ms-form-route.js` (potentially move it to `src/ms-form-route.js` for consistency).
    - Update the `esbuild` command in `package.json` to bundle the necessary files (e.g., `src/ecommerce-redirect.js` and `src/ms-form-route.js` or a main entry point that imports them) into the single output file `dist/ms-form-route.js`.

2.  **Identify Key HTML Elements:**

    - Locate the form (`id="wf-form-SMB"` in `index.html`).
    - Identify the input/select elements for:
      - E-commerce seller question (`id="Are-you-an-ecommerce-seller"`)
      - Funding amount (`id="Funding-Amount"`)
      - Average monthly sales (`id="Revenue-per-month"`)
      - Funding reason (`id="Use-of-funds"`)

3.  **Implement Redirect Logic (in `src/ecommerce-redirect.js`):**

    - Add a `DOMContentLoaded` event listener (or export an initialization function).
    - Get references to the identified HTML elements.
    - Add helper functions:
      - `cleanDollarValue(inputElement)`: To parse and validate dollar amount inputs, removing '$' and ',', ensuring the value is a positive integer. Returns the number or `null`.
      - `getMappedFundingReason(selectElement)`: To map the selected funding reason ("Inventory", "Marketing", "Other Business Expense") to the required lowercase parameter values ("inventory", "marketing", "other"). Returns the mapped value or `null`.
    - Attach a `change` event listener to the `Are-you-an-ecommerce-seller` select element.
    - **Inside the `change` listener:**
      - Check if the selected value is "Yes".
      - If "Yes":
        - Call helper functions to get cleaned/validated `fundingAmount`, `avgMonthlySales`, and `fundingReason`.
        - Create a `URLSearchParams` object.
        - Append `marketing_survey_upsert_survey_form[online_merchant]=true`.
        - Conditionally append `marketing_survey_upsert_survey_form[funding_amount]`, `marketing_survey_upsert_survey_form[average_monthly_sales]`, and `marketing_survey_upsert_survey_form[funding_reason]` only if their corresponding cleaned/mapped values are not `null`.
        - Construct the final redirect URL: `https://app.onrampfunds.com/smb-signup?${params.toString()}`.
        - Trigger the redirect using `window.location.href`.
      - If "No": Allow the form to proceed with its default multi-step/submission behavior (handled by `ms-form-route.js`).

4.  **Refactor `ms-form-route.js` (Optional but Recommended):**

    - Ensure the existing code in `ms-form-route.js` doesn't conflict with the redirect logic (e.g., prevent HubSpot submission if a redirect occurs).
    - Consider moving this file to `src/ms-form-route.js`.

5.  **Update Build Process (`package.json`):**

    - Modify the `scripts.build` and `scripts.build:prod` commands to correctly bundle the JavaScript files from the `src/` directory into `dist/ms-form-route.js`.

6.  **Testing:**
    - Test the "Yes" path: Fill relevant fields, select "Yes", verify redirect URL and parameters.
    - Test the "No" path: Select "No", verify the form proceeds through its steps and submits normally.
    - Test edge cases: Select "Yes" with invalid/missing amounts, empty funding reason, etc.

## Target URL Parameter Format

The redirect URL should follow this structure:

`https://app.onrampfunds.com/smb-signup?marketing_survey_upsert_survey_form[parameter_name]=value&...`

- `online_merchant`: `true` (required for redirect)
- `funding_amount`: Integer > 0 (optional, appended if valid)
- `average_monthly_sales`: Integer > 0 (optional, appended if valid)
- `funding_reason`: "inventory", "marketing", or "other" (optional, appended if validly selected and mapped)
