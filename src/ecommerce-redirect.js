// E-commerce redirect logic will go here

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wf-form-SMB");
  const ecommerceSellerSelect = document.getElementById("Are-you-an-ecommerce-seller");
  const fundingAmountInput = document.getElementById("Funding-Amount");
  const avgMonthlySalesInput = document.getElementById("Revenue-per-month");
  const fundingReasonSelect = document.getElementById("Use-of-funds");

  if (!form || !ecommerceSellerSelect || !fundingAmountInput || !avgMonthlySalesInput || !fundingReasonSelect) {
    console.error("One or more required form elements not found.");
    return;
  }

  /**
   * Cleans and validates a dollar input value.
   * @param {HTMLInputElement} inputElement The input element.
   * @returns {number|null} The cleaned integer value or null if invalid.
   */
  function cleanDollarValue(inputElement) {
    const value = inputElement.value.replace(/[\$,]/g, "");
    const number = parseInt(value, 10);
    return !isNaN(number) && number > 0 ? number : null;
  }

  /**
   * Maps the selected funding reason to the required lowercase parameter value.
   * @param {HTMLSelectElement} selectElement The select element.
   * @returns {string|null} The mapped value or null if no valid option is selected.
   */
  function getMappedFundingReason(selectElement) {
    const selectedValue = selectElement.value;
    const mapping = {
      "Inventory": "inventory",
      "Marketing": "marketing",
      "Other Business Expense": "other", // Assuming this maps to 'other'
    };
    return mapping[selectedValue] || null;
  }

  ecommerceSellerSelect.addEventListener("change", (event) => {
    if (event.target.value === "Yes") {
      const fundingAmount = cleanDollarValue(fundingAmountInput);
      const avgMonthlySales = cleanDollarValue(avgMonthlySalesInput);
      const fundingReason = getMappedFundingReason(fundingReasonSelect);

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

      const redirectUrl = `https://app.onrampfunds.com/smb-signup?${params.toString()}`;
      console.log("Redirecting to:", redirectUrl); // For debugging
      window.location.href = redirectUrl;
    }
    // If 'No', do nothing here, let the existing form logic handle it.
  });
});
