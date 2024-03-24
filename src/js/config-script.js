// Selectors
const selectors = {
  timerOneToggleKey: "#timer-one-toggle-key",
  timerTwoToggleKey: "#timer-two-toggle-key",
  nextKey: "#next-key",
  previousKey: "#previous-key",
  shiftKey: "#shift-key",
  settingsButton: "#settingsButton",
  settingsModal: "#settingsModal",
  closeButton: ".close-button",
  data: "#data",
  background: "#background",
};

var data = null;
var background = null;

// Short-hand for getting elements
const getElement = (selector) => document.querySelector(selector);

// Toggle modal display
const toggleModal = (display) => {
  getElement(selectors.settingsModal).style.display = display
    ? "block"
    : "none";
};

// Event listeners for modal
getElement(selectors.settingsButton).addEventListener("click", () =>
  toggleModal(true)
);
getElement(selectors.closeButton).addEventListener("click", () =>
  toggleModal(false)
);

// Save settings to localStorage
const saveSettings = () => {
  Object.entries(selectors).forEach(([key, selector]) => {
    if (
      key !== "settingsButton" &&
      key !== "settingsModal" &&
      key !== "closeButton"
    ) {
      const element = getElement(selector);
      if(key === "data") {
        localStorage.setItem(key, data);
      } else {
        localStorage.setItem(key, element.value);
      }
      
    }
  });
  toggleModal(false); // Hide modal after save
};

// Load settings from localStorage with default values
const loadSettings = () => {
  const defaultKeys = {
    timerOneToggleKey: "KeyQ",
    timerTwoToggleKey: "KeyW",
    nextKey: "Period",
    previousKey: "Comma",
    shiftKey: "KeyA",
  };

  Object.keys(defaultKeys).forEach((key) => {
    const value = localStorage.getItem(key) || defaultKeys[key];
    getElement(selectors[key]).value = value;
  });
};

// Initialize settings on window load
window.addEventListener("load", loadSettings);

// Configure inputs to capture key codes
document.querySelectorAll(".config-input-type").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    event.preventDefault();
    input.value = event.code;
  });
});

document
  .getElementById("data")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (file) {
      const text = JSON.parse(await file.text()); // Check the actual text content
      data = text;
    }
  });
