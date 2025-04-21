console.log("Form handler script loaded");

// Load HubSpot Forms Script
function loadHubSpotScript() {
  const script = document.createElement("script");
  script.src = "https://js.hsforms.net/forms/embed/19654160.js";
  script.defer = true;
  document.head.appendChild(script);
}

// Function to format input as dollar amount
function formatDollarAmount(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");

  // Format the number with commas and no cents
  value = Number(value).toLocaleString("en-US", {
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

// Function to format date as MM/DD
function formatDate(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");

  // Only proceed if we have digits
  if (value.length > 0) {
    // Handle month (limit to 12)
    if (value.length >= 2) {
      let month = parseInt(value.substring(0, 2));
      if (month > 12) month = 12;
      if (month < 1) month = 1;
      month = month.toString().padStart(2, "0");

      // Add day if we have more digits
      if (value.length > 2) {
        let day = parseInt(value.substring(2, 4));
        if (day > 31) day = 31;
        if (day < 1) day = 1;
        day = day.toString().padStart(2, "0");
        value = month + "/" + day;
      } else {
        value = month;
      }
    }

    // Add slash if exactly 2 digits
    if (value.length === 2) {
      value += "/";
    }
  }

  // Limit to MM/DD format
  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  input.value = value;
}

// Find all inputs with data-type="dollar"
const dollarInputs = document.querySelectorAll('input[data-type="dollar"]');
console.log("Found dollar inputs:", dollarInputs.length);

// Add event listeners to each dollar input
dollarInputs.forEach((input) => {
  console.log("Adding listener to input:", input);
  input.addEventListener("input", function () {
    console.log("Input event triggered, current value:", this.value);
    // Only format if the input is not empty
    if (this.value.trim() !== "") {
      formatDollarAmount(this);
    }
  });
});

// Add date formatting to business start date input
const startDateInput = document.getElementById("When-did-you-start-your-business");
if (startDateInput) {
  startDateInput.addEventListener("input", function () {
    formatDate(this);
  });
}

// HubSpot form submission handler
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  // Load HubSpot Forms script
  loadHubSpotScript();

  const form = document.getElementById("wf-form-SMB");
  console.log("Found form element:", form);

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

  // Format form data for HubSpot
  function formatFormData(formData) {
    const fields = [];
    const context = {
      hutk: getHubSpotCookie(),
      ...getPageInfo(),
    };

    // Map form fields to HubSpot fields - only the essential ones
    const fieldMapping = {
      "First-Name": "firstname",
      "Last-Name": "lastname",
      "Email": "email",
      "Phone": "phone",
      "Registered-Business-Name": "business_name",
      "Industry": "industry",
      "Funding-Amount": "user_reported_desired_amount",
      "Revenue-per-month": "user_reported_monthly_revenue",
      "Use-of-funds": "use_of_funds",
      "Timeline-For-Loan": "when_do_you_need_the_loan_",
    };

    console.log("Raw form data entries:", Object.fromEntries(formData));

    // Create fields array for HubSpot
    for (const [webflowField, hubspotField] of Object.entries(fieldMapping)) {
      const value = formData.get(webflowField);
      if (value) {
        console.log(`Mapping ${webflowField} (${value}) to ${hubspotField}`);
        fields.push({
          name: hubspotField,
          value: value,
        });
      }
    }

    // Add business state if present
    const businessState = document.querySelector(".is-custom-select");
    if (businessState && businessState.value && businessState.value !== "Business state*") {
      console.log(`Adding business state: ${businessState.value}`);
      fields.push({
        name: "state",
        value: businessState.value,
      });
    }

    const formattedData = { fields, context };
    console.log("Formatted HubSpot data:", JSON.stringify(formattedData, null, 2));
    return formattedData;
  }

  // Submit to HubSpot
  async function submitToHubSpot(formData) {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const data = formatFormData(formData);

    console.log("Submitting to HubSpot URL:", url);
    console.log("With data:", JSON.stringify(data, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("HubSpot submission successful:", responseData);
      } else {
        console.error("HubSpot submission failed:", responseData);
        console.error("Response status:", response.status);
        console.error("Response headers:", Object.fromEntries(response.headers));
      }

      if (!response.ok) {
        throw new Error(`HubSpot submission failed: ${responseData.message || "Unknown error"}`);
      }

      return responseData;
    } catch (error) {
      console.error("Error submitting to HubSpot:", error);
      throw error;
    }
  }

  // Instead of form submit listener, use Formly's submit button
  const formlySubmitBtn = document.querySelector("#submit");
  if (formlySubmitBtn) {
    console.log("Found Formly submit button, adding click listener");
    formlySubmitBtn.addEventListener("click", async function (e) {
      console.log("Formly submit button clicked - preparing HubSpot submission");

      const successMessage = document.querySelector(".w-form-done");
      const errorMessage = document.querySelector(".w-form-fail");

      try {
        console.log("Starting HubSpot submission process");
        const formData = new FormData(form);
        // Log the form data being collected
        console.log("Form data collected:", Object.fromEntries(formData));

        const result = await submitToHubSpot(formData);
        console.log("HubSpot submission completed successfully");
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
