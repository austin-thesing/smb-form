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

  // <define:process.env.CONFIG>
  var define_process_env_CONFIG_default = { webflowFormId: "wf-form-main-hero-form", hubspotFormId: "44b5a828-468f-4814-a71e-04ab7d1fd89a", redirectBaseUrl: "https://app.onrampfunds.com/signup" };

  // src/core/ecommerce-redirect.js
  var config = define_process_env_CONFIG_default;
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById(config.webflowFormId);
    const ecommerceSellerSelect = document.getElementById("Are-you-an-ecommerce-seller");
    const fundingAmountInput = document.getElementById("Funding-Amount");
    const avgMonthlySalesInput = document.getElementById("Revenue-per-month");
    const fundingReasonSelect = document.getElementById("Use-of-funds");
    if (!form || !ecommerceSellerSelect || !fundingAmountInput || !avgMonthlySalesInput || !fundingReasonSelect) {
      console.error("One or more required form elements not found.");
      return;
    }
    function cleanDollarValue(inputElement) {
      const value = inputElement.value.replace(/[\$,]/g, "");
      const number = parseInt(value, 10);
      return !isNaN(number) && number > 0 ? number : null;
    }
    function getMappedFundingReason(selectElement) {
      const selectedValue = selectElement.value;
      const mapping = {
        "Inventory": "inventory",
        "Marketing": "marketing",
        "Other Business Expense": "other"
        // Assuming this maps to 'other'
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
        const redirectUrl = `${config.redirectBaseUrl}?${params.toString()}`;
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      }
    });
  });

  // src/core/ms-form-route.js
  var config2 = define_process_env_CONFIG_default;
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
  function getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  }
  function populateUtmFields() {
    const params = getUrlParams();
    const utmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    utmFields.forEach((field) => {
      if (params[field]) {
        let input = document.querySelector(`input[name="${field}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = field;
          const form = document.getElementById(config2.webflowFormId);
          if (form) {
            form.appendChild(input);
          }
        }
        input.value = params[field];
      }
    });
  }
  window.addEventListener("load", function() {
    if (window._hsq) {
      window._hsq.push(["setPath", window.location.pathname]);
      window._hsq.push(["trackPageView"]);
    }
    populateUtmFields();
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
    const form = document.getElementById(config2.webflowFormId);
    if (!form) {
      console.error("Form element not found! Check if the form ID is correct.");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window._hsq && !window._formViewTracked) {
          window._hsq.push(["trackEvent", { id: "form_view" }]);
          window._formViewTracked = true;
          window._hsq.push([
            "trackForms",
            {
              formId: config2.hubspotFormId,
              formInstanceId: form.getAttribute("data-form-instance-id") || "1"
            }
          ]);
        }
      });
    });
    observer.observe(form);
    const portalId = "19654160";
    const formId = config2.hubspotFormId;
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
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        let cookieValue = parts.pop().split(";").shift();
        try {
          return JSON.parse(decodeURIComponent(cookieValue));
        } catch (e) {
          return cookieValue;
        }
      }
      return null;
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
              "trackFormSubmission",
              formId,
              {
                formVariant: "A",
                formInstanceId: form.getAttribute("data-form-instance-id") || "1"
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
      console.log("Raw form data for ecommerce seller:", formData.get("Are-you-an-ecommerce-seller"));
      const cleanDollarAmount = (value) => {
        if (!value)
          return value;
        return value.replace(/[$,]/g, "").trim();
      };
      const utmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
      utmFields.forEach((field) => {
        const value = formData.get(field);
        if (value) {
          fields.push({
            name: field,
            value: value.trim()
          });
        }
      });
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
        "Are-You-An-Ecommerce-Seller": "ecommerce_seller",
        "Do-you-have-a-business-bank-account": "business_bank_account"
      };
      for (const [webflowField, hubspotField] of Object.entries(fieldMapping)) {
        let value = formData.get(webflowField);
        if (webflowField === "Are-you-an-ecommerce-seller") {
          console.log("Ecommerce seller field mapping:", {
            webflowField,
            hubspotField,
            value
          });
        }
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
      console.log("Final HubSpot submission fields:", {
        allFields: fields,
        ecommerceField: fields.find((f) => f.name === "ecommerce_seller")
      });
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
          try {
            const formData = new FormData(form);
            if (window._hsq) {
              window._hsq.push(["trackEvent", { id: "form_submit_attempt" }]);
            }
            const result = yield submitToHubSpot(formData);
            if (window._hsq) {
              window._hsq.push([
                "trackFormSubmission",
                formId,
                {
                  formVariant: "A",
                  formInstanceId: form.getAttribute("data-form-instance-id") || "1"
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
          } catch (error) {
            console.error("HubSpot submission failed:", error);
            const errorMessage = document.querySelector(".w-form-fail");
            if (errorMessage) {
              errorMessage.style.display = "block";
            }
            if (window._hsq) {
              window._hsq.push([
                "trackEvent",
                {
                  id: "form_submission_error",
                  value: error.message
                }
              ]);
            }
          }
        });
      });
    } else {
      console.error("Formly submit button not found! Check if the button ID is correct.");
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiPGRlZmluZTpwcm9jZXNzLmVudi5DT05GSUc+IiwgIi4uLy4uL2NvcmUvZWNvbW1lcmNlLXJlZGlyZWN0LmpzIiwgIi4uLy4uL2NvcmUvbXMtZm9ybS1yb3V0ZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiIiwgIi8vIEdldCBjb25maWcgZnJvbSBidWlsZCBwcm9jZXNzXG5jb25zdCBjb25maWcgPSBwcm9jZXNzLmVudi5DT05GSUc7XG5cbi8vIEUtY29tbWVyY2UgcmVkaXJlY3QgbG9naWMgd2lsbCBnbyBoZXJlXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbmZpZy53ZWJmbG93Rm9ybUlkKTtcbiAgY29uc3QgZWNvbW1lcmNlU2VsbGVyU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJBcmUteW91LWFuLWVjb21tZXJjZS1zZWxsZXJcIik7XG4gIGNvbnN0IGZ1bmRpbmdBbW91bnRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiRnVuZGluZy1BbW91bnRcIik7XG4gIGNvbnN0IGF2Z01vbnRobHlTYWxlc0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJSZXZlbnVlLXBlci1tb250aFwiKTtcbiAgY29uc3QgZnVuZGluZ1JlYXNvblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVXNlLW9mLWZ1bmRzXCIpO1xuXG4gIGlmICghZm9ybSB8fCAhZWNvbW1lcmNlU2VsbGVyU2VsZWN0IHx8ICFmdW5kaW5nQW1vdW50SW5wdXQgfHwgIWF2Z01vbnRobHlTYWxlc0lucHV0IHx8ICFmdW5kaW5nUmVhc29uU2VsZWN0KSB7XG4gICAgY29uc29sZS5lcnJvcihcIk9uZSBvciBtb3JlIHJlcXVpcmVkIGZvcm0gZWxlbWVudHMgbm90IGZvdW5kLlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIGFuZCB2YWxpZGF0ZXMgYSBkb2xsYXIgaW5wdXQgdmFsdWUuXG4gICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gaW5wdXRFbGVtZW50IFRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfG51bGx9IFRoZSBjbGVhbmVkIGludGVnZXIgdmFsdWUgb3IgbnVsbCBpZiBpbnZhbGlkLlxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYW5Eb2xsYXJWYWx1ZShpbnB1dEVsZW1lbnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGlucHV0RWxlbWVudC52YWx1ZS5yZXBsYWNlKC9bXFwkLF0vZywgXCJcIik7XG4gICAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICByZXR1cm4gIWlzTmFOKG51bWJlcikgJiYgbnVtYmVyID4gMCA/IG51bWJlciA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyB0aGUgc2VsZWN0ZWQgZnVuZGluZyByZWFzb24gdG8gdGhlIHJlcXVpcmVkIGxvd2VyY2FzZSBwYXJhbWV0ZXIgdmFsdWUuXG4gICAqIEBwYXJhbSB7SFRNTFNlbGVjdEVsZW1lbnR9IHNlbGVjdEVsZW1lbnQgVGhlIHNlbGVjdCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfG51bGx9IFRoZSBtYXBwZWQgdmFsdWUgb3IgbnVsbCBpZiBubyB2YWxpZCBvcHRpb24gaXMgc2VsZWN0ZWQuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRNYXBwZWRGdW5kaW5nUmVhc29uKHNlbGVjdEVsZW1lbnQpIHtcbiAgICBjb25zdCBzZWxlY3RlZFZhbHVlID0gc2VsZWN0RWxlbWVudC52YWx1ZTtcbiAgICBjb25zdCBtYXBwaW5nID0ge1xuICAgICAgXCJJbnZlbnRvcnlcIjogXCJpbnZlbnRvcnlcIixcbiAgICAgIFwiTWFya2V0aW5nXCI6IFwibWFya2V0aW5nXCIsXG4gICAgICBcIk90aGVyIEJ1c2luZXNzIEV4cGVuc2VcIjogXCJvdGhlclwiLCAvLyBBc3N1bWluZyB0aGlzIG1hcHMgdG8gJ290aGVyJ1xuICAgIH07XG4gICAgcmV0dXJuIG1hcHBpbmdbc2VsZWN0ZWRWYWx1ZV0gfHwgbnVsbDtcbiAgfVxuXG4gIGVjb21tZXJjZVNlbGxlclNlbGVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09IFwiWWVzXCIpIHtcbiAgICAgIGNvbnN0IGZ1bmRpbmdBbW91bnQgPSBjbGVhbkRvbGxhclZhbHVlKGZ1bmRpbmdBbW91bnRJbnB1dCk7XG4gICAgICBjb25zdCBhdmdNb250aGx5U2FsZXMgPSBjbGVhbkRvbGxhclZhbHVlKGF2Z01vbnRobHlTYWxlc0lucHV0KTtcbiAgICAgIGNvbnN0IGZ1bmRpbmdSZWFzb24gPSBnZXRNYXBwZWRGdW5kaW5nUmVhc29uKGZ1bmRpbmdSZWFzb25TZWxlY3QpO1xuXG4gICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICBwYXJhbXMuYXBwZW5kKFwibWFya2V0aW5nX3N1cnZleV91cHNlcnRfc3VydmV5X2Zvcm1bb25saW5lX21lcmNoYW50XVwiLCBcInRydWVcIik7XG5cbiAgICAgIGlmIChmdW5kaW5nQW1vdW50ICE9PSBudWxsKSB7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQoXCJtYXJrZXRpbmdfc3VydmV5X3Vwc2VydF9zdXJ2ZXlfZm9ybVtmdW5kaW5nX2Ftb3VudF1cIiwgZnVuZGluZ0Ftb3VudCk7XG4gICAgICB9XG4gICAgICBpZiAoYXZnTW9udGhseVNhbGVzICE9PSBudWxsKSB7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQoXCJtYXJrZXRpbmdfc3VydmV5X3Vwc2VydF9zdXJ2ZXlfZm9ybVthdmVyYWdlX21vbnRobHlfc2FsZXNdXCIsIGF2Z01vbnRobHlTYWxlcyk7XG4gICAgICB9XG4gICAgICBpZiAoZnVuZGluZ1JlYXNvbiAhPT0gbnVsbCkge1xuICAgICAgICBwYXJhbXMuYXBwZW5kKFwibWFya2V0aW5nX3N1cnZleV91cHNlcnRfc3VydmV5X2Zvcm1bZnVuZGluZ19yZWFzb25dXCIsIGZ1bmRpbmdSZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWRpcmVjdFVybCA9IGAke2NvbmZpZy5yZWRpcmVjdEJhc2VVcmx9PyR7cGFyYW1zLnRvU3RyaW5nKCl9YDtcbiAgICAgIGNvbnNvbGUubG9nKFwiUmVkaXJlY3RpbmcgdG86XCIsIHJlZGlyZWN0VXJsKTsgLy8gRm9yIGRlYnVnZ2luZ1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZWRpcmVjdFVybDtcbiAgICB9XG4gICAgLy8gSWYgJ05vJywgZG8gbm90aGluZyBoZXJlLCBsZXQgdGhlIGV4aXN0aW5nIGZvcm0gbG9naWMgaGFuZGxlIGl0LlxuICB9KTtcbn0pO1xuIiwgIi8vIEdldCBjb25maWcgZnJvbSBidWlsZCBwcm9jZXNzXG5jb25zdCBjb25maWcgPSBwcm9jZXNzLmVudi5DT05GSUc7XG5cbmltcG9ydCBcIi4vZWNvbW1lcmNlLXJlZGlyZWN0LmpzXCI7XG5cbi8vIEh1YlNwb3QgdHJhY2tpbmcgaW5pdGlhbGl6YXRpb25cbihmdW5jdGlvbiAoZCwgcywgaSwgcikge1xuICBpZiAoZC5nZXRFbGVtZW50QnlJZChpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IGQuY3JlYXRlRWxlbWVudChzKSxcbiAgICBlID0gZC5nZXRFbGVtZW50c0J5VGFnTmFtZShzKVswXTtcbiAgbi5pZCA9IGk7XG4gIG4uc3JjID0gXCIvL2pzLmhzLWFuYWx5dGljcy5uZXQvYW5hbHl0aWNzL1wiICsgTWF0aC5jZWlsKG5ldyBEYXRlKCkgLyByKSAqIHIgKyBcIi8xOTY1NDE2MC5qc1wiO1xuXG4gIC8vIEFkZCBvbmxvYWQgaGFuZGxlciB0byBlbnN1cmUgdHJhY2tpbmcgaGFwcGVucyBhZnRlciBzY3JpcHQgbG9hZHNcbiAgbi5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5faHNxKSB7XG4gICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcInNldFBhdGhcIiwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXSk7XG4gICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcInRyYWNrUGFnZVZpZXdcIl0pO1xuICAgIH1cbiAgfTtcblxuICBlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG4sIGUpO1xufSkoZG9jdW1lbnQsIFwic2NyaXB0XCIsIFwiaHMtYW5hbHl0aWNzXCIsIDMwMDAwMCk7XG5cbi8vIEZ1bmN0aW9uIHRvIGdldCBVUkwgcGFyYW1ldGVyc1xuZnVuY3Rpb24gZ2V0VXJsUGFyYW1zKCkge1xuICBjb25zdCBwYXJhbXMgPSB7fTtcbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2Ygc2VhcmNoUGFyYW1zKSB7XG4gICAgcGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gcGFyYW1zO1xufVxuXG4vLyBGdW5jdGlvbiB0byBwb3B1bGF0ZSBVVE0gZmllbGRzIGluIHRoZSBmb3JtXG5mdW5jdGlvbiBwb3B1bGF0ZVV0bUZpZWxkcygpIHtcbiAgY29uc3QgcGFyYW1zID0gZ2V0VXJsUGFyYW1zKCk7XG4gIGNvbnN0IHV0bUZpZWxkcyA9IFtcInV0bV9zb3VyY2VcIiwgXCJ1dG1fbWVkaXVtXCIsIFwidXRtX2NhbXBhaWduXCIsIFwidXRtX3Rlcm1cIiwgXCJ1dG1fY29udGVudFwiXTtcblxuICB1dG1GaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICBpZiAocGFyYW1zW2ZpZWxkXSkge1xuICAgICAgLy8gVHJ5IHRvIGZpbmQgZXhpc3RpbmcgaW5wdXQgZmllbGRcbiAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XCIke2ZpZWxkfVwiXWApO1xuXG4gICAgICAvLyBJZiBpbnB1dCBkb2Vzbid0IGV4aXN0LCBjcmVhdGUgaXRcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgICAgICBpbnB1dC5uYW1lID0gZmllbGQ7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb25maWcud2ViZmxvd0Zvcm1JZCk7XG4gICAgICAgIGlmIChmb3JtKSB7XG4gICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSB2YWx1ZVxuICAgICAgaW5wdXQudmFsdWUgPSBwYXJhbXNbZmllbGRdO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIEFkZGl0aW9uYWwgcGFnZSB2aWV3IHRyYWNraW5nIG9uIHdpbmRvdyBsb2FkXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICBpZiAod2luZG93Ll9oc3EpIHtcbiAgICB3aW5kb3cuX2hzcS5wdXNoKFtcInNldFBhdGhcIiwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXSk7XG4gICAgd2luZG93Ll9oc3EucHVzaChbXCJ0cmFja1BhZ2VWaWV3XCJdKTtcbiAgfVxuXG4gIC8vIFBvcHVsYXRlIFVUTSBmaWVsZHMgaW1tZWRpYXRlbHlcbiAgcG9wdWxhdGVVdG1GaWVsZHMoKTtcbn0pO1xuXG4vLyBMb2FkIEh1YlNwb3QgRm9ybXMgU2NyaXB0XG5mdW5jdGlvbiBsb2FkSHViU3BvdFNjcmlwdCgpIHtcbiAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgc2NyaXB0LnNyYyA9IFwiaHR0cHM6Ly9qcy5oc2Zvcm1zLm5ldC9mb3Jtcy9lbWJlZC8xOTY1NDE2MC5qc1wiO1xuICBzY3JpcHQuZGVmZXIgPSB0cnVlO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG5cbi8vIEZ1bmN0aW9uIHRvIGZvcm1hdCBpbnB1dCBhcyBkb2xsYXIgYW1vdW50XG5mdW5jdGlvbiBmb3JtYXREb2xsYXJBbW91bnQoaW5wdXQpIHtcbiAgLy8gUmVtb3ZlIGFueSBub24tZGlnaXQgY2hhcmFjdGVyc1xuICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgXCJcIik7XG5cbiAgLy8gSWYgZW1wdHkgb3Igb25seSBub24tbnVtZXJpYyBjaGFyYWN0ZXJzLCBjbGVhciB0aGUgaW5wdXRcbiAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgaW5wdXQudmFsdWUgPSBcIlwiO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdG8gbnVtYmVyIGFuZCBlbnN1cmUgaXQncyB2YWxpZFxuICBsZXQgbnVtVmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XG4gIGlmIChpc05hTihudW1WYWx1ZSkpIHtcbiAgICBpbnB1dC52YWx1ZSA9IFwiXCI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9ybWF0IHRoZSBudW1iZXIgd2l0aCBjb21tYXMgYW5kIG5vIGNlbnRzXG4gIHZhbHVlID0gbnVtVmFsdWUudG9Mb2NhbGVTdHJpbmcoXCJlbi1VU1wiLCB7XG4gICAgc3R5bGU6IFwiY3VycmVuY3lcIixcbiAgICBjdXJyZW5jeTogXCJVU0RcIixcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDAsXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwLFxuICB9KTtcblxuICAvLyBSZW1vdmUgdGhlIGN1cnJlbmN5IHN5bWJvbCAod2UnbGwgYWRkIGl0IG1hbnVhbGx5IHRvIHByZXNlcnZlIGN1cnNvciBwb3NpdGlvbilcbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eXFwkLywgXCJcIik7XG5cbiAgLy8gVXBkYXRlIHRoZSBpbnB1dCB2YWx1ZVxuICBpbnB1dC52YWx1ZSA9IFwiJFwiICsgdmFsdWU7XG59XG5cbi8vIEZ1bmN0aW9uIHRvIGZvcm1hdCBkYXRlIGFzIE1NL1lZIHdpdGggdmFsaWRhdGlvblxuZnVuY3Rpb24gZm9ybWF0RGF0ZShpbnB1dCkge1xuICAvLyBSZW1vdmUgYW55IG5vbi1kaWdpdCBjaGFyYWN0ZXJzXG4gIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblxuICAvLyBIYW5kbGUgbW9udGggdmFsaWRhdGlvblxuICBpZiAodmFsdWUubGVuZ3RoID49IDIpIHtcbiAgICBsZXQgbW9udGggPSBwYXJzZUludCh2YWx1ZS5zbGljZSgwLCAyKSk7XG4gICAgaWYgKG1vbnRoID09PSAwKSBtb250aCA9IDE7XG4gICAgaWYgKG1vbnRoID4gMTIpIG1vbnRoID0gMTI7XG4gICAgdmFsdWUgPSBtb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKSArIHZhbHVlLnNsaWNlKDIpO1xuICB9XG5cbiAgLy8gQWRkIHNsYXNoIGFmdGVyIGZpcnN0IHR3byBkaWdpdHNcbiAgaWYgKHZhbHVlLmxlbmd0aCA+IDIpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIDIpICsgXCIvXCIgKyB2YWx1ZS5zbGljZSgyKTtcbiAgfVxuXG4gIC8vIExpbWl0IHRvIE1NL1lZIGZvcm1hdCAoNSBjaGFyYWN0ZXJzKVxuICBpZiAodmFsdWUubGVuZ3RoID4gNSkge1xuICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgNSk7XG4gIH1cblxuICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xufVxuXG4vLyBGaW5kIGFsbCBpbnB1dHMgd2l0aCBkYXRhLXR5cGU9XCJkb2xsYXJcIlxuY29uc3QgZG9sbGFySW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS10eXBlPVwiZG9sbGFyXCJdJyk7XG5kb2xsYXJJbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy52YWx1ZS50cmltKCkgIT09IFwiXCIpIHtcbiAgICAgIGZvcm1hdERvbGxhckFtb3VudCh0aGlzKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbi8vIEhhbmRsZSBGdW5kaW5nLUFtb3VudCBpbnB1dFxuY29uc3QgZnVuZGluZ0lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJGdW5kaW5nLUFtb3VudFwiKTtcbmlmIChmdW5kaW5nSW5wdXQpIHtcbiAgZnVuZGluZ0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICBmb3JtYXREb2xsYXJBbW91bnQodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gSGFuZGxlIFJldmVudWUtcGVyLW1vbnRoIGlucHV0XG5jb25zdCByZXZlbnVlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlJldmVudWUtcGVyLW1vbnRoXCIpO1xuaWYgKHJldmVudWVJbnB1dCkge1xuICByZXZlbnVlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy52YWx1ZS50cmltKCkgIT09IFwiXCIpIHtcbiAgICAgIGZvcm1hdERvbGxhckFtb3VudCh0aGlzKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBBZGQgZGF0ZSBmb3JtYXR0aW5nIHRvIGJ1c2luZXNzIHN0YXJ0IGRhdGUgaW5wdXRcbmNvbnN0IHN0YXJ0RGF0ZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXaGVuLWRpZC15b3Utc3RhcnQteW91ci1idXNpbmVzc1wiKTtcbmlmIChzdGFydERhdGVJbnB1dCkge1xuICBzdGFydERhdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGZvcm1hdERhdGUodGhpcyk7XG4gIH0pO1xufVxuXG4vLyBIdWJTcG90IGZvcm0gc3VibWlzc2lvbiBoYW5kbGVyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gIC8vIExvYWQgSHViU3BvdCBGb3JtcyBzY3JpcHRcbiAgbG9hZEh1YlNwb3RTY3JpcHQoKTtcblxuICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29uZmlnLndlYmZsb3dGb3JtSWQpO1xuXG4gIGlmICghZm9ybSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJGb3JtIGVsZW1lbnQgbm90IGZvdW5kISBDaGVjayBpZiB0aGUgZm9ybSBJRCBpcyBjb3JyZWN0LlwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUcmFjayBpbml0aWFsIGZvcm0gdmlldyB3aGVuIGZvcm0gYmVjb21lcyB2aXNpYmxlXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nICYmIHdpbmRvdy5faHNxICYmICF3aW5kb3cuX2Zvcm1WaWV3VHJhY2tlZCkge1xuICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcInRyYWNrRXZlbnRcIiwgeyBpZDogXCJmb3JtX3ZpZXdcIiB9XSk7XG4gICAgICAgIHdpbmRvdy5fZm9ybVZpZXdUcmFja2VkID0gdHJ1ZTtcblxuICAgICAgICAvLyBUcmFjayBmb3JtIGFzIEh1YlNwb3QgZm9ybSB2aWV3XG4gICAgICAgIHdpbmRvdy5faHNxLnB1c2goW1xuICAgICAgICAgIFwidHJhY2tGb3Jtc1wiLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZvcm1JZDogY29uZmlnLmh1YnNwb3RGb3JtSWQsXG4gICAgICAgICAgICBmb3JtSW5zdGFuY2VJZDogZm9ybS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZvcm0taW5zdGFuY2UtaWRcIikgfHwgXCIxXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIG9ic2VydmVyLm9ic2VydmUoZm9ybSk7XG5cbiAgLy8gSHViU3BvdCBmb3JtIGNvbmZpZ3VyYXRpb25cbiAgY29uc3QgcG9ydGFsSWQgPSBcIjE5NjU0MTYwXCI7XG4gIGNvbnN0IGZvcm1JZCA9IGNvbmZpZy5odWJzcG90Rm9ybUlkO1xuXG4gIC8vIEdldCBIdWJTcG90IHRyYWNraW5nIGNvb2tpZVxuICBmdW5jdGlvbiBnZXRIdWJTcG90Q29va2llKCkge1xuICAgIHJldHVybiAoXG4gICAgICBkb2N1bWVudC5jb29raWVcbiAgICAgICAgLnNwbGl0KFwiOyBcIilcbiAgICAgICAgLmZpbmQoKHJvdykgPT4gcm93LnN0YXJ0c1dpdGgoXCJodWJzcG90dXRrPVwiKSlcbiAgICAgICAgPy5zcGxpdChcIj1cIilbMV0gfHwgXCJcIlxuICAgICk7XG4gIH1cblxuICAvLyBHZXQgcGFnZSBpbmZvIGZvciBIdWJTcG90IGNvbnRleHRcbiAgZnVuY3Rpb24gZ2V0UGFnZUluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZ2VVcmk6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgcGFnZU5hbWU6IGRvY3VtZW50LnRpdGxlLFxuICAgIH07XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBnZXQgYW5kIHBhcnNlIGNvb2tpZSB2YWx1ZVxuICBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIGNvbnN0IHZhbHVlID0gYDsgJHtkb2N1bWVudC5jb29raWV9YDtcbiAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KGA7ICR7bmFtZX09YCk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgbGV0IGNvb2tpZVZhbHVlID0gcGFydHMucG9wKCkuc3BsaXQoXCI7XCIpLnNoaWZ0KCk7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcnkgdG8gcGFyc2UgYXMgSlNPTlxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoY29va2llVmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWYgbm90IEpTT04sIHJldHVybiBhcyBpc1xuICAgICAgICByZXR1cm4gY29va2llVmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gU3VibWl0IHRvIEh1YlNwb3RcbiAgYXN5bmMgZnVuY3Rpb24gc3VibWl0VG9IdWJTcG90KGZvcm1EYXRhKSB7XG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLmhzZm9ybXMuY29tL3N1Ym1pc3Npb25zL3YzL2ludGVncmF0aW9uL3N1Ym1pdC8ke3BvcnRhbElkfS8ke2Zvcm1JZH1gO1xuICAgIGNvbnN0IGRhdGEgPSBmb3JtYXRGb3JtRGF0YShmb3JtRGF0YSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcIkh1YlNwb3QgU3VibWlzc2lvbiBEZXRhaWxzOlwiKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlVSTDpcIiwgdXJsKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlBvcnRhbCBJRDpcIiwgcG9ydGFsSWQpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiRm9ybSBJRDpcIiwgZm9ybUlkKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkRhdGEgU3RydWN0dXJlOlwiLCBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gVHJhY2sgZm9ybSBzdGFydCBpZiBub3QgYWxyZWFkeSB0cmFja2VkXG4gICAgICBpZiAod2luZG93Ll9oc3EgJiYgIXdpbmRvdy5fZm9ybVN0YXJ0VHJhY2tlZCkge1xuICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcInRyYWNrRXZlbnRcIiwgeyBpZDogXCJmb3JtX3N0YXJ0XCIgfV0pO1xuICAgICAgICB3aW5kb3cuX2Zvcm1TdGFydFRyYWNrZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSHViU3BvdCBFcnJvciBEZXRhaWxzOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlN0YXR1czpcIiwgcmVzcG9uc2Uuc3RhdHVzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlJlc3BvbnNlIERhdGE6XCIsIHJlc3BvbnNlRGF0YSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJGaWVsZHMgU2VudDpcIixcbiAgICAgICAgICBkYXRhLmZpZWxkcy5tYXAoKGYpID0+IGAke2YubmFtZX06ICR7Zi52YWx1ZX1gKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIFRyYWNrIGZvcm0gc3VibWlzc2lvbiBmYWlsdXJlXG4gICAgICAgIGlmICh3aW5kb3cuX2hzcSkge1xuICAgICAgICAgIHdpbmRvdy5faHNxLnB1c2goW1xuICAgICAgICAgICAgXCJ0cmFja0V2ZW50XCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBcImZvcm1fc3VibWlzc2lvbl9lcnJvclwiLFxuICAgICAgICAgICAgICB2YWx1ZTogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSHViU3BvdCBzdWJtaXNzaW9uIGZhaWxlZDogJHtyZXNwb25zZURhdGEubWVzc2FnZSB8fCBcIlVua25vd24gZXJyb3JcIn1gKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHJhY2sgc3VjY2Vzc2Z1bCBmb3JtIHN1Ym1pc3Npb25cbiAgICAgIGlmICh3aW5kb3cuX2hzcSkge1xuICAgICAgICAvLyBUcmFjayBmb3JtIHN1Ym1pc3Npb24gYXMgY29udmVyc2lvblxuICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcbiAgICAgICAgICBcInRyYWNrRm9ybVN1Ym1pc3Npb25cIixcbiAgICAgICAgICBmb3JtSWQsXG4gICAgICAgICAge1xuICAgICAgICAgICAgZm9ybVZhcmlhbnQ6IFwiQVwiLFxuICAgICAgICAgICAgZm9ybUluc3RhbmNlSWQ6IGZvcm0uZ2V0QXR0cmlidXRlKFwiZGF0YS1mb3JtLWluc3RhbmNlLWlkXCIpIHx8IFwiMVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIFRyYWNrIGZvcm0gc3VibWlzc2lvbiBzdWNjZXNzIGV2ZW50XG4gICAgICAgIHdpbmRvdy5faHNxLnB1c2goW1widHJhY2tFdmVudFwiLCB7IGlkOiBcImZvcm1fc3VibWlzc2lvbl9zdWNjZXNzXCIgfV0pO1xuXG4gICAgICAgIC8vIElkZW50aWZ5IHRoZSB1c2VyXG4gICAgICAgIHdpbmRvdy5faHNxLnB1c2goW1xuICAgICAgICAgIFwiaWRlbnRpZnlcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlbWFpbDogZm9ybURhdGEuZ2V0KFwiRW1haWxcIiksXG4gICAgICAgICAgICBmaXJzdG5hbWU6IGZvcm1EYXRhLmdldChcIkZpcnN0LU5hbWVcIiksXG4gICAgICAgICAgICBsYXN0bmFtZTogZm9ybURhdGEuZ2V0KFwiTGFzdC1OYW1lXCIpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgICAgfVxuXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkh1YlNwb3Qgc3VibWlzc2lvbiBzdWNjZXNzZnVsOlwiLCByZXNwb25zZURhdGEpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN1Ym1pdHRpbmcgdG8gSHViU3BvdDpcIiwgZXJyb3IpO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLy8gRm9ybWF0IGZvcm0gZGF0YSBmb3IgSHViU3BvdFxuICBmdW5jdGlvbiBmb3JtYXRGb3JtRGF0YShmb3JtRGF0YSkge1xuICAgIGNvbnN0IGZpZWxkcyA9IFtdO1xuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICBodXRrOiBnZXRIdWJTcG90Q29va2llKCksXG4gICAgICAuLi5nZXRQYWdlSW5mbygpLFxuICAgIH07XG5cbiAgICAvLyBEZWJ1ZyBsb2dnaW5nIGZvciBlY29tbWVyY2Ugc2VsbGVyIGZpZWxkXG4gICAgY29uc29sZS5sb2coXCJSYXcgZm9ybSBkYXRhIGZvciBlY29tbWVyY2Ugc2VsbGVyOlwiLCBmb3JtRGF0YS5nZXQoXCJBcmUteW91LWFuLWVjb21tZXJjZS1zZWxsZXJcIikpO1xuXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNsZWFuIGRvbGxhciBhbW91bnRzXG4gICAgY29uc3QgY2xlYW5Eb2xsYXJBbW91bnQgPSAodmFsdWUpID0+IHtcbiAgICAgIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9bJCxdL2csIFwiXCIpLnRyaW0oKTtcbiAgICB9O1xuXG4gICAgLy8gQWRkIFVUTSBwYXJhbWV0ZXJzIGZyb20gZm9ybSBmaWVsZHMgdG8gSHViU3BvdCBzdWJtaXNzaW9uXG4gICAgY29uc3QgdXRtRmllbGRzID0gW1widXRtX3NvdXJjZVwiLCBcInV0bV9tZWRpdW1cIiwgXCJ1dG1fY2FtcGFpZ25cIiwgXCJ1dG1fdGVybVwiLCBcInV0bV9jb250ZW50XCJdO1xuICAgIHV0bUZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmb3JtRGF0YS5nZXQoZmllbGQpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBmaWVsZCxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUudHJpbSgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIE1hcCBmb3JtIGZpZWxkcyB0byBIdWJTcG90IGZpZWxkcyAtIG9ubHkgdGhlIGVzc2VudGlhbCBvbmVzXG4gICAgY29uc3QgZmllbGRNYXBwaW5nID0ge1xuICAgICAgXCJGaXJzdC1OYW1lXCI6IFwiZmlyc3RuYW1lXCIsXG4gICAgICBcIkxhc3QtTmFtZVwiOiBcImxhc3RuYW1lXCIsXG4gICAgICBcIkVtYWlsXCI6IFwiZW1haWxcIixcbiAgICAgIFwiUGhvbmVcIjogXCJwaG9uZVwiLFxuICAgICAgXCJSZWdpc3RlcmVkLUJ1c2luZXNzLU5hbWVcIjogXCJidXNpbmVzc19uYW1lXCIsXG4gICAgICBcIkluZHVzdHJ5XCI6IFwiaW5kdXN0cnlfX2Ryb3Bkb3duX1wiLFxuICAgICAgXCJGdW5kaW5nLUFtb3VudFwiOiBcInVzZXJfcmVwb3J0ZWRfZGVzaXJlZF9hbW91bnRcIixcbiAgICAgIFwiUmV2ZW51ZS1wZXItbW9udGhcIjogXCJ1c2VyX3JlcG9ydGVkX21vbnRobHlfcmV2ZW51ZVwiLFxuICAgICAgXCJVc2Utb2YtZnVuZHNcIjogXCJ1c2Vfb2ZfZnVuZHNcIixcbiAgICAgIFwiVGltZWxpbmUtRm9yLUxvYW5cIjogXCJ3aGVuX2RvX3lvdV9uZWVkX3RoZV9sb2FuX1wiLFxuICAgICAgXCJXaGVuLWRpZC15b3Utc3RhcnQteW91ci1idXNpbmVzc1wiOiBcInllYXJfZm91bmRlZFwiLFxuICAgICAgXCJBcmUtWW91LUFuLUVjb21tZXJjZS1TZWxsZXJcIjogXCJlY29tbWVyY2Vfc2VsbGVyXCIsXG4gICAgICBcIkRvLXlvdS1oYXZlLWEtYnVzaW5lc3MtYmFuay1hY2NvdW50XCI6IFwiYnVzaW5lc3NfYmFua19hY2NvdW50XCIsXG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBmaWVsZHMgYXJyYXkgZm9yIEh1YlNwb3RcbiAgICBmb3IgKGNvbnN0IFt3ZWJmbG93RmllbGQsIGh1YnNwb3RGaWVsZF0gb2YgT2JqZWN0LmVudHJpZXMoZmllbGRNYXBwaW5nKSkge1xuICAgICAgbGV0IHZhbHVlID0gZm9ybURhdGEuZ2V0KHdlYmZsb3dGaWVsZCk7XG5cbiAgICAgIC8vIERlYnVnIGxvZ2dpbmcgZm9yIGZpZWxkIG1hcHBpbmdcbiAgICAgIGlmICh3ZWJmbG93RmllbGQgPT09IFwiQXJlLXlvdS1hbi1lY29tbWVyY2Utc2VsbGVyXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFY29tbWVyY2Ugc2VsbGVyIGZpZWxkIG1hcHBpbmc6XCIsIHtcbiAgICAgICAgICB3ZWJmbG93RmllbGQsXG4gICAgICAgICAgaHVic3BvdEZpZWxkLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgSW5kdXN0cnkgZmllbGRcbiAgICAgIGlmICh3ZWJmbG93RmllbGQgPT09IFwiSW5kdXN0cnlcIikge1xuICAgICAgICBjb25zdCBpbmR1c3RyeVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiSW5kdXN0cnlcIik7XG4gICAgICAgIGlmIChpbmR1c3RyeVNlbGVjdCAmJiBpbmR1c3RyeVNlbGVjdC52YWx1ZSkge1xuICAgICAgICAgIHZhbHVlID0gaW5kdXN0cnlTZWxlY3QudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgICAvLyBDbGVhbiBkb2xsYXIgYW1vdW50cyBmb3Igc3BlY2lmaWMgZmllbGRzXG4gICAgICAgIGlmICh3ZWJmbG93RmllbGQgPT09IFwiRnVuZGluZy1BbW91bnRcIiB8fCB3ZWJmbG93RmllbGQgPT09IFwiUmV2ZW51ZS1wZXItbW9udGhcIikge1xuICAgICAgICAgIHZhbHVlID0gY2xlYW5Eb2xsYXJBbW91bnQodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgaW5kdXN0cnlfX2Ryb3Bkb3duX1xuICAgICAgICBpZiAoaHVic3BvdEZpZWxkID09PSBcImluZHVzdHJ5X19kcm9wZG93bl9cIikge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IFwiaW5kdXN0cnlfX2Ryb3Bkb3duX1wiLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnRyaW0oKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWVsZHMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBodWJzcG90RmllbGQsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUudHJpbSgpLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGJ1c2luZXNzIHN0YXRlIHdpdGggY29ycmVjdCBIdWJTcG90IGZpZWxkIG5hbWVcbiAgICBjb25zdCBidXNpbmVzc1N0YXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5pcy1jdXN0b20tc2VsZWN0XCIpO1xuICAgIGlmIChidXNpbmVzc1N0YXRlICYmIGJ1c2luZXNzU3RhdGUudmFsdWUgJiYgYnVzaW5lc3NTdGF0ZS52YWx1ZSAhPT0gXCJCdXNpbmVzcyBzdGF0ZSpcIikge1xuICAgICAgZmllbGRzLnB1c2goe1xuICAgICAgICBuYW1lOiBcImNvbnRhY3Rfc3RhdGVcIixcbiAgICAgICAgdmFsdWU6IGJ1c2luZXNzU3RhdGUudmFsdWUudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTG9nIGZpbmFsIGRhdGEgc3RydWN0dXJlIGJlZm9yZSBzdWJtaXNzaW9uXG4gICAgY29uc29sZS5sb2coXCJGaW5hbCBIdWJTcG90IHN1Ym1pc3Npb24gZmllbGRzOlwiLCB7XG4gICAgICBhbGxGaWVsZHM6IGZpZWxkcyxcbiAgICAgIGVjb21tZXJjZUZpZWxkOiBmaWVsZHMuZmluZCgoZikgPT4gZi5uYW1lID09PSBcImVjb21tZXJjZV9zZWxsZXJcIiksXG4gICAgfSk7XG5cbiAgICByZXR1cm4geyBmaWVsZHMsIGNvbnRleHQgfTtcbiAgfVxuXG4gIC8vIEluc3RlYWQgb2YgZm9ybSBzdWJtaXQgbGlzdGVuZXIsIHVzZSBGb3JtbHkncyBzdWJtaXQgYnV0dG9uXG4gIGNvbnN0IGZvcm1seVN1Ym1pdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3VibWl0XCIpO1xuICBpZiAoZm9ybWx5U3VibWl0QnRuKSB7XG4gICAgLy8gVHJhY2sgZm9ybSBzdGVwIHByb2dyZXNzaW9uXG4gICAgY29uc3QgdHJhY2tGb3JtU3RlcCA9IChzdGVwTnVtYmVyKSA9PiB7XG4gICAgICBpZiAod2luZG93Ll9oc3EpIHtcbiAgICAgICAgd2luZG93Ll9oc3EucHVzaChbXG4gICAgICAgICAgXCJ0cmFja0V2ZW50XCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IFwiZm9ybV9zdGVwX2NvbXBsZXRlXCIsXG4gICAgICAgICAgICB2YWx1ZTogc3RlcE51bWJlcixcbiAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQWRkIHN0ZXAgdHJhY2tpbmcgdG8gbmV4dCBidXR0b25zXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZm9ybT1cIm5leHQtYnRuXCJdJykuZm9yRWFjaCgoYnRuLCBpbmRleCkgPT4ge1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRyYWNrRm9ybVN0ZXAoaW5kZXggKyAxKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZm9ybWx5U3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyBmdW5jdGlvbiAoZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG5cbiAgICAgICAgLy8gVHJhY2sgZm9ybSBzdWJtaXNzaW9uIGF0dGVtcHRcbiAgICAgICAgaWYgKHdpbmRvdy5faHNxKSB7XG4gICAgICAgICAgd2luZG93Ll9oc3EucHVzaChbXCJ0cmFja0V2ZW50XCIsIHsgaWQ6IFwiZm9ybV9zdWJtaXRfYXR0ZW1wdFwiIH1dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN1Ym1pdFRvSHViU3BvdChmb3JtRGF0YSk7XG5cbiAgICAgICAgLy8gVHJhY2sgc3VjY2Vzc2Z1bCBmb3JtIHN1Ym1pc3Npb25cbiAgICAgICAgaWYgKHdpbmRvdy5faHNxKSB7XG4gICAgICAgICAgLy8gVHJhY2sgZm9ybSBzdWJtaXNzaW9uIGFzIGNvbnZlcnNpb25cbiAgICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcbiAgICAgICAgICAgIFwidHJhY2tGb3JtU3VibWlzc2lvblwiLFxuICAgICAgICAgICAgZm9ybUlkLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmb3JtVmFyaWFudDogXCJBXCIsXG4gICAgICAgICAgICAgIGZvcm1JbnN0YW5jZUlkOiBmb3JtLmdldEF0dHJpYnV0ZShcImRhdGEtZm9ybS1pbnN0YW5jZS1pZFwiKSB8fCBcIjFcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSk7XG5cbiAgICAgICAgICAvLyBUcmFjayBmb3JtIHN1Ym1pc3Npb24gc3VjY2VzcyBldmVudFxuICAgICAgICAgIHdpbmRvdy5faHNxLnB1c2goW1widHJhY2tFdmVudFwiLCB7IGlkOiBcImZvcm1fc3VibWlzc2lvbl9zdWNjZXNzXCIgfV0pO1xuXG4gICAgICAgICAgLy8gSWRlbnRpZnkgdGhlIHVzZXJcbiAgICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcbiAgICAgICAgICAgIFwiaWRlbnRpZnlcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZW1haWw6IGZvcm1EYXRhLmdldChcIkVtYWlsXCIpLFxuICAgICAgICAgICAgICBmaXJzdG5hbWU6IGZvcm1EYXRhLmdldChcIkZpcnN0LU5hbWVcIiksXG4gICAgICAgICAgICAgIGxhc3RuYW1lOiBmb3JtRGF0YS5nZXQoXCJMYXN0LU5hbWVcIiksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSHViU3BvdCBzdWJtaXNzaW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnctZm9ybS1mYWlsXCIpO1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcmFjayBmb3JtIHN1Ym1pc3Npb24gZmFpbHVyZVxuICAgICAgICBpZiAod2luZG93Ll9oc3EpIHtcbiAgICAgICAgICB3aW5kb3cuX2hzcS5wdXNoKFtcbiAgICAgICAgICAgIFwidHJhY2tFdmVudFwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogXCJmb3JtX3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICAgICAgdmFsdWU6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcIkZvcm1seSBzdWJtaXQgYnV0dG9uIG5vdCBmb3VuZCEgQ2hlY2sgaWYgdGhlIGJ1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
