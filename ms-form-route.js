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
