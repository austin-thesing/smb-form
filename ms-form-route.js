// HubSpot tracking initialization
(function (d, s, i, r) {
  if (d.getElementById(i)) {
    return;
  }
  var n = d.createElement(s),
    e = d.getElementsByTagName(s)[0];
  n.id = i;
  n.src = "//js.hs-analytics.net/analytics/" + Math.ceil(new Date() / r) * r + "/19654160.js";
  e.parentNode.insertBefore(n, e);
})(document, "script", "hs-analytics", 300000);

// Initialize form analytics
window.addEventListener("load", function () {
  if (window._hsq) {
    // Track page view
    window._hsq.push(["setPath", window.location.pathname]);
    window._hsq.push(["trackPageView"]);
  }
});

// Load HubSpot Forms Script
function loadHubSpotScript() {
  const script = document.createElement("script");
  script.src = "https://js.hsforms.net/forms/embed/19654160.js";
  script.defer = true;
  document.head.appendChild(script);
}

// Function to format input as dollar amount with cap
function formatDollarAmount(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");

  // If empty or only non-numeric characters, clear the input
  if (value === "") {
    input.value = "";
    return;
  }

  // Convert to number and ensure it's valid
  let numValue = parseInt(value);
  if (isNaN(numValue)) {
    input.value = "";
    return;
  }

  // Limit to 2 million
  if (numValue > 2000000) {
    numValue = 2000000;
  }

  // Format the number with commas and no cents
  value = numValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Remove the currency symbol (we'll add it manually to preserve cursor position)
  value = value.replace(/^\$/, "");

  // Update the input value
  input.value = "$" + value;
}

// Function to format input as dollar amount without cap
function formatDollarAmountUncapped(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");

  // If empty or only non-numeric characters, clear the input
  if (value === "") {
    input.value = "";
    return;
  }

  // Convert to number and ensure it's valid
  let numValue = parseInt(value);
  if (isNaN(numValue)) {
    input.value = "";
    return;
  }

  // Format the number with commas and no cents
  value = numValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Remove the currency symbol (we'll add it manually to preserve cursor position)
  value = value.replace(/^\$/, "");

  // Update the input value
  input.value = "$" + value;
}

// Function to format date as MM/YY with validation
function formatDate(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");

  // Handle month validation
  if (value.length >= 2) {
    let month = parseInt(value.slice(0, 2));
    if (month === 0) month = 1;
    if (month > 12) month = 12;
    value = month.toString().padStart(2, "0") + value.slice(2);
  }

  // Add slash after first two digits
  if (value.length > 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  // Limit to MM/YY format (5 characters)
  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  input.value = value;
}

// Find all inputs with data-type="dollar"
const dollarInputs = document.querySelectorAll('input[data-type="dollar"]');
dollarInputs.forEach((input) => {
  // Skip the Funding-Amount and Revenue-per-month fields as they're handled separately
  if (input.id !== "Funding-Amount" && input.id !== "Revenue-per-month") {
    input.addEventListener("input", function () {
      if (this.value.trim() !== "") {
        formatDollarAmountUncapped(this);
      }
    });
  }
});

// Handle Funding-Amount input without cap
const fundingInput = document.getElementById("Funding-Amount");
if (fundingInput) {
  fundingInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      formatDollarAmountUncapped(this);
    }
  });
}

// Handle Revenue-per-month input without cap
const revenueInput = document.getElementById("Revenue-per-month");
if (revenueInput) {
  revenueInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      formatDollarAmountUncapped(this);
    }
  });
}

// Add date formatting to business start date input
const startDateInput = document.getElementById("When-did-you-start-your-business");
if (startDateInput) {
  startDateInput.addEventListener("input", function () {
    formatDate(this);
  });
}

// HubSpot form submission handler
document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM Content Loaded");

  // Load HubSpot Forms script
  loadHubSpotScript();

  const form = document.getElementById("wf-form-SMB");
  // console.log("Found form element:", form);

  if (!form) {
    console.error("Form element not found! Check if the form ID is correct.");
    return;
  }

  // HubSpot form configuration
  const portalId = "19654160"; // Your HubSpot portal ID
  const formId = "e387a024-a165-4d47-956c-23e0e1f6b7eb"; // Your HubSpot form GUID

  // Get HubSpot tracking cookie
  function getHubSpotCookie() {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("hubspotutk="))
        ?.split("=")[1] || ""
    );
  }

  // Get page info for HubSpot context
  function getPageInfo() {
    return {
      pageUri: window.location.href,
      pageName: document.title,
    };
  }

  // Submit to HubSpot
  async function submitToHubSpot(formData) {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const data = formatFormData(formData);

    // console.log("HubSpot Submission Details:");
    // console.log("URL:", url);
    // console.log("Portal ID:", portalId);
    // console.log("Form ID:", formId);
    // console.log("Data Structure:", JSON.stringify(data, null, 2));

    try {
      // Track form start if not already tracked
      if (window._hsq && !window._formStartTracked) {
        window._hsq.push(["trackEvent", { id: "form_start" }]);
        window._formStartTracked = true;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("HubSpot Error Details:");
        console.error("Status:", response.status);
        console.error("Response Data:", responseData);
        console.error(
          "Fields Sent:",
          data.fields.map((f) => `${f.name}: ${f.value}`)
        );

        // Track form submission failure
        if (window._hsq) {
          window._hsq.push([
            "trackEvent",
            {
              id: "form_submission_error",
              value: response.status,
            },
          ]);
        }

        throw new Error(`HubSpot submission failed: ${responseData.message || "Unknown error"}`);
      }

      // Track successful form submission
      if (window._hsq) {
        window._hsq.push(["trackEvent", { id: "form_submission_success" }]);
        window._hsq.push([
          "identify",
          {
            email: formData.get("Email"),
            firstname: formData.get("First-Name"),
            lastname: formData.get("Last-Name"),
          },
        ]);
      }

      // console.log("HubSpot submission successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error submitting to HubSpot:", error);
      throw error;
    }
  }

  // Format form data for HubSpot
  function formatFormData(formData) {
    const fields = [];
    const context = {
      hutk: getHubSpotCookie(),
      ...getPageInfo(),
    };

    // Helper function to clean dollar amounts
    const cleanDollarAmount = (value) => {
      if (!value) return value;
      return value.replace(/[$,]/g, "").trim();
    };

    // Map form fields to HubSpot fields - only the essential ones
    const fieldMapping = {
      "First-Name": "firstname",
      "Last-Name": "lastname",
      "Email": "email",
      "Phone": "phone",
      "Registered-Business-Name": "business_name",
      "Industry": "industry__dropdown_",
      "Funding-Amount": "user_reported_desired_amount",
      "Revenue-per-month": "user_reported_monthly_revenue",
      "Use-of-funds": "use_of_funds",
      "Timeline-For-Loan": "when_do_you_need_the_loan_",
      "When-did-you-start-your-business": "year_founded",
      "Are-you-an-ecommerce-seller": "ecommerce_seller",
    };

    // Create fields array for HubSpot
    for (const [webflowField, hubspotField] of Object.entries(fieldMapping)) {
      let value = formData.get(webflowField);

      // Special handling for Industry field
      if (webflowField === "Industry") {
        const industrySelect = document.getElementById("Industry");
        if (industrySelect && industrySelect.value) {
          value = industrySelect.value;
        }
      }

      if (value && value.trim() !== "") {
        // Clean dollar amounts for specific fields
        if (webflowField === "Funding-Amount" || webflowField === "Revenue-per-month") {
          value = cleanDollarAmount(value);
        }

        // Special handling for industry__dropdown_
        if (hubspotField === "industry__dropdown_") {
          fields.push({
            name: "industry__dropdown_",
            value: value.trim(),
          });
        } else {
          fields.push({
            name: hubspotField,
            value: value.trim(),
          });
        }
      }
    }

    // Add business state with correct HubSpot field name
    const businessState = document.querySelector(".is-custom-select");
    if (businessState && businessState.value && businessState.value !== "Business state*") {
      fields.push({
        name: "contact_state",
        value: businessState.value.trim(),
      });
    }

    // Log final data for debugging
    // console.log(
    //   "Fields being sent to HubSpot:",
    //   fields.map((f) => `${f.name}: ${f.value}`)
    // );

    return { fields, context };
  }

  // Instead of form submit listener, use Formly's submit button
  const formlySubmitBtn = document.querySelector("#submit");
  if (formlySubmitBtn) {
    // console.log("Found Formly submit button, adding click listener");

    // Track form step progression
    const trackFormStep = (stepNumber) => {
      if (window._hsq) {
        window._hsq.push([
          "trackEvent",
          {
            id: "form_step_complete",
            value: stepNumber,
          },
        ]);
      }
    };

    // Add step tracking to next buttons
    document.querySelectorAll('[data-form="next-btn"]').forEach((btn, index) => {
      btn.addEventListener("click", () => {
        trackFormStep(index + 1);
      });
    });

    formlySubmitBtn.addEventListener("click", async function (e) {
      // console.log("Formly submit button clicked - preparing HubSpot submission");

      const successMessage = document.querySelector(".w-form-done");
      const errorMessage = document.querySelector(".w-form-fail");

      try {
        // console.log("Starting HubSpot submission process");
        const formData = new FormData(form);
        // console.log("Form data collected:", Object.fromEntries(formData));

        const result = await submitToHubSpot(formData);
        // console.log("HubSpot submission completed successfully");
        // Let Formly handle the success UI
      } catch (error) {
        console.error("HubSpot submission failed:", error);
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
      }
    });
  } else {
    console.error("Formly submit button not found! Check if the button ID is correct.");
  }
});
