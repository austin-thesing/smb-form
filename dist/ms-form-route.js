(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ms-form-route.js
  (function(d, s, i, r) {
    if (d.getElementById(i)) {
      return;
    }
    var n = d.createElement(s), e = d.getElementsByTagName(s)[0];
    n.id = i;
    n.src = "//js.hs-analytics.net/analytics/" + Math.ceil(/* @__PURE__ */ new Date() / r) * r + "/19654160.js";
    n.onload = function() {
      if (window._hsq) {
        window._hsq.push(["setPath", window.location.pathname]);
        window._hsq.push(["trackPageView"]);
      }
    };
    e.parentNode.insertBefore(n, e);
  })(document, "script", "hs-analytics", 3e5);
  window.addEventListener("load", function() {
    if (window._hsq) {
      window._hsq.push(["setPath", window.location.pathname]);
      window._hsq.push(["trackPageView"]);
    }
  });
  function loadHubSpotScript() {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/19654160.js";
    script.defer = true;
    document.head.appendChild(script);
  }
  function formatDollarAmount(input) {
    let value = input.value.replace(/\D/g, "");
    if (value === "") {
      input.value = "";
      return;
    }
    let numValue = parseInt(value);
    if (isNaN(numValue)) {
      input.value = "";
      return;
    }
    value = numValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    value = value.replace(/^\$/, "");
    input.value = "$" + value;
  }
  function formatDate(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
      let month = parseInt(value.slice(0, 2));
      if (month === 0)
        month = 1;
      if (month > 12)
        month = 12;
      value = month.toString().padStart(2, "0") + value.slice(2);
    }
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    input.value = value;
  }
  var dollarInputs = document.querySelectorAll('input[data-type="dollar"]');
  dollarInputs.forEach((input) => {
    input.addEventListener("input", function() {
      if (this.value.trim() !== "") {
        formatDollarAmount(this);
      }
    });
  });
  var fundingInput = document.getElementById("Funding-Amount");
  if (fundingInput) {
    fundingInput.addEventListener("input", function() {
      if (this.value.trim() !== "") {
        formatDollarAmount(this);
      }
    });
  }
  var revenueInput = document.getElementById("Revenue-per-month");
  if (revenueInput) {
    revenueInput.addEventListener("input", function() {
      if (this.value.trim() !== "") {
        formatDollarAmount(this);
      }
    });
  }
  var startDateInput = document.getElementById("When-did-you-start-your-business");
  if (startDateInput) {
    startDateInput.addEventListener("input", function() {
      formatDate(this);
    });
  }
  document.addEventListener("DOMContentLoaded", function() {
    loadHubSpotScript();
    const form = document.getElementById("wf-form-SMB");
    if (!form) {
      console.error("Form element not found! Check if the form ID is correct.");
      return;
    }
    const portalId = "19654160";
    const formId = "e387a024-a165-4d47-956c-23e0e1f6b7eb";
    function getHubSpotCookie() {
      var _a;
      return ((_a = document.cookie.split("; ").find((row) => row.startsWith("hubspotutk="))) == null ? void 0 : _a.split("=")[1]) || "";
    }
    function getPageInfo() {
      return {
        pageUri: window.location.href,
        pageName: document.title
      };
    }
    function submitToHubSpot(formData) {
      return __async(this, null, function* () {
        const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
        const data = formatFormData(formData);
        try {
          if (window._hsq && !window._formStartTracked) {
            window._hsq.push(["trackEvent", { id: "form_start" }]);
            window._formStartTracked = true;
          }
          const response = yield fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
          const responseData = yield response.json();
          if (!response.ok) {
            console.error("HubSpot Error Details:");
            console.error("Status:", response.status);
            console.error("Response Data:", responseData);
            console.error(
              "Fields Sent:",
              data.fields.map((f) => `${f.name}: ${f.value}`)
            );
            if (window._hsq) {
              window._hsq.push([
                "trackEvent",
                {
                  id: "form_submission_error",
                  value: response.status
                }
              ]);
            }
            throw new Error(`HubSpot submission failed: ${responseData.message || "Unknown error"}`);
          }
          if (window._hsq) {
            window._hsq.push([
              "trackConversion",
              {
                id: formId
              }
            ]);
            window._hsq.push(["trackEvent", { id: "form_submission_success" }]);
            window._hsq.push([
              "identify",
              {
                email: formData.get("Email"),
                firstname: formData.get("First-Name"),
                lastname: formData.get("Last-Name")
              }
            ]);
          }
          return responseData;
        } catch (error) {
          console.error("Error submitting to HubSpot:", error);
          throw error;
        }
      });
    }
    function formatFormData(formData) {
      const fields = [];
      const context = __spreadValues({
        hutk: getHubSpotCookie()
      }, getPageInfo());
      const cleanDollarAmount = (value) => {
        if (!value)
          return value;
        return value.replace(/[$,]/g, "").trim();
      };
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
        "Are-you-an-ecommerce-seller": "ecommerce_seller"
      };
      for (const [webflowField, hubspotField] of Object.entries(fieldMapping)) {
        let value = formData.get(webflowField);
        if (webflowField === "Industry") {
          const industrySelect = document.getElementById("Industry");
          if (industrySelect && industrySelect.value) {
            value = industrySelect.value;
          }
        }
        if (value && value.trim() !== "") {
          if (webflowField === "Funding-Amount" || webflowField === "Revenue-per-month") {
            value = cleanDollarAmount(value);
          }
          if (hubspotField === "industry__dropdown_") {
            fields.push({
              name: "industry__dropdown_",
              value: value.trim()
            });
          } else {
            fields.push({
              name: hubspotField,
              value: value.trim()
            });
          }
        }
      }
      const businessState = document.querySelector(".is-custom-select");
      if (businessState && businessState.value && businessState.value !== "Business state*") {
        fields.push({
          name: "contact_state",
          value: businessState.value.trim()
        });
      }
      return { fields, context };
    }
    const formlySubmitBtn = document.querySelector("#submit");
    if (formlySubmitBtn) {
      const trackFormStep = (stepNumber) => {
        if (window._hsq) {
          window._hsq.push([
            "trackEvent",
            {
              id: "form_step_complete",
              value: stepNumber
            }
          ]);
        }
      };
      document.querySelectorAll('[data-form="next-btn"]').forEach((btn, index) => {
        btn.addEventListener("click", () => {
          trackFormStep(index + 1);
        });
      });
      formlySubmitBtn.addEventListener("click", function(e) {
        return __async(this, null, function* () {
          const successMessage = document.querySelector(".w-form-done");
          const errorMessage = document.querySelector(".w-form-fail");
          try {
            const formData = new FormData(form);
            const result = yield submitToHubSpot(formData);
          } catch (error) {
            console.error("HubSpot submission failed:", error);
            errorMessage.style.display = "block";
            successMessage.style.display = "none";
          }
        });
      });
    } else {
      console.error("Formly submit button not found! Check if the button ID is correct.");
    }
  });
})();
//# sourceMappingURL=ms-form-route.js.map
