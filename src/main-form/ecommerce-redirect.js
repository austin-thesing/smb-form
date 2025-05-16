// DEBUG FLAG: Set to true to enable debug logging
const DEBUG = true;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wf-form-main-hero-form");
  const ecommerceSellerSelect = document.getElementById("Are-you-an-ecommerce-seller");
  const fundingAmountInput = document.getElementById("Funding-Amount");
  const avgMonthlySalesInput = document.getElementById("Revenue-per-month");
  const fundingReasonSelect = document.getElementById("Use-of-funds");

  // Improved error handling for missing elements
  const missing = [];
  if (!form) missing.push("wf-form-main-hero-form");
  if (!ecommerceSellerSelect) missing.push("Are-you-an-ecommerce-seller");
  if (!fundingAmountInput) missing.push("Funding-Amount");
  if (!avgMonthlySalesInput) missing.push("Revenue-per-month");
  if (!fundingReasonSelect) missing.push("Use-of-funds");
  if (missing.length) {
    if (DEBUG) console.error("Missing required form elements:", missing.join(", "));
    return;
  }

  /**
   * Cleans and validates a dollar input value.
   * @param {HTMLInputElement} inputElement The input element.
   * @returns {number|null} The cleaned integer value or null if invalid.
   */
  function cleanDollarValue(inputElement) {
    const value = inputElement.value.replace(/[\$,]/g, "");
    if (DEBUG) console.log(`[DEBUG] Cleaning dollar value for ${inputElement.id}: raw=${inputElement.value}, cleaned=${value}`);
    const number = parseInt(value, 10);
    if (DEBUG) console.log(`[DEBUG] Parsed number for ${inputElement.id}:`, number);
    return !isNaN(number) && number > 0 ? number : null;
  }

  /**
   * Maps the selected funding reason to the required lowercase parameter value.
   * @param {HTMLSelectElement} selectElement The select element.
   * @returns {string|null} The mapped value or null if no valid option is selected.
   */
  function getMappedFundingReason(selectElement) {
    const selectedValue = selectElement.value;
    if (DEBUG) console.log(`[DEBUG] Selected funding reason: ${selectedValue}`);
    const mapping = {
      "Inventory": "inventory",
      "Marketing": "marketing",
      "Other Business Expense": "other", // Assuming this maps to 'other'
    };
    const mapped = mapping[selectedValue] || null;
    if (DEBUG) console.log(`[DEBUG] Mapped funding reason: ${mapped}`);
    return mapped;
  }

  ecommerceSellerSelect.addEventListener("change", (event) => {
    if (DEBUG) console.log(`[DEBUG] Ecommerce seller changed: ${event.target.value}`);
    if (event.target.value === "Yes") {
      const fundingAmount = cleanDollarValue(fundingAmountInput);
      const avgMonthlySales = cleanDollarValue(avgMonthlySalesInput);
      const fundingReason = getMappedFundingReason(fundingReasonSelect);
      if (DEBUG) {
        console.log(`[DEBUG] Funding Amount:`, fundingAmount);
        console.log(`[DEBUG] Avg Monthly Sales:`, avgMonthlySales);
        console.log(`[DEBUG] Funding Reason:`, fundingReason);
      }
      const params = new URLSearchParams();
      params.append("marketing_survey_upsert_survey_form[online_merchant]", "true");
      if (fundingAmount !== null) {
        params.append("marketing_survey_upsert_survey_form[funding_amount]", fundingAmount);
      }
      if (avgMonthlySales !== null) {
        params.append("marketing_survey_upsert_survey_form[average_monthly_sales]", avgMonthlySales);
      }
      if (fundingReason !== null) {
        params.append("marketing_survey_upsert_survey_form[funding_reason]", fundingReason);
      }
      const redirectUrl = `https://app.onrampfunds.com/signup?${params.toString()}`;
      if (DEBUG) console.log("[DEBUG] Redirecting to:", redirectUrl);
      window.location.href = redirectUrl;
    }
    // If 'No', do nothing here, let the existing form logic handle it.
  });
});
