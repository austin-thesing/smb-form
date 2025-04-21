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
  console.log("Initial input value:", input.value);

  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, "");
  console.log("After removing non-digits:", value);

  // Format the number with commas and no cents
  value = Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  console.log("After formatting:", value);

  // Remove the currency symbol (we'll add it manually to preserve cursor position)
  value = value.replace(/^\$/, "");
  console.log("After removing $ symbol:", value);

  // Update the input value
  input.value = "$" + value;
  console.log("Final formatted value:", input.value);
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
      pageId: document.querySelector("[data-wf-page-id]")?.getAttribute("data-wf-page-id") || "",
    };
  }

  // Format form data for HubSpot
  function formatFormData(formData) {
    const fields = [];
    const context = {
      hutk: getHubSpotCookie(),
      pageUri: getPageInfo().pageUri,
      pageName: getPageInfo().pageName,
      pageId: getPageInfo().pageId,
      ipAddress: document.querySelector('input[name="ipAddress"]').value,
    };

    // Map form fields to HubSpot fields
    const fieldMapping = {
      "Funding-Amount": "user_reported_desired_amount",
      "Revenue-per-month": "user_reported_monthly_revenue",
      "Use-of-funds": "use_of_funds",
      "Timeline-For-Loan": "when_do_you_need_the_loan_",
      "First-Name": "firstname",
      "Last-Name": "lastname",
      "Email": "email",
      "Phone": "phone",
      "Registered-Business-Name": "business_name",
      "When-did-you-start-your-business": "year_founded",
      "Are-you-an-ecommerce-seller": "ecommerce_seller",
      "Industry": "industry",
    };

    // Create fields array for HubSpot
    for (const [webflowField, hubspotField] of Object.entries(fieldMapping)) {
      const value = formData.get(webflowField);
      if (value) {
        fields.push({
          name: hubspotField,
          value: value,
        });
      }
    }

    // Add business state separately since it has a custom select
    const businessState = document.querySelector(".is-custom-select").value;
    if (businessState && businessState !== "Business state*") {
      fields.push({
        name: "state",
        value: businessState,
      });
    }

    return {
      fields,
      context,
    };
  }

  // Submit to HubSpot
  async function submitToHubSpot(formData) {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
    const data = formatFormData(formData);

    // Log the data being sent to HubSpot
    console.log("Submitting to HubSpot with data:", data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      // Log the response from HubSpot
      if (response.ok) {
        console.log("HubSpot submission successful:", responseData);
      } else {
        console.error("HubSpot submission failed:", responseData);
      }

      if (!response.ok) {
        throw new Error("HubSpot submission failed");
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
