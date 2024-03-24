import { Timer } from "./timer.js";
// Constant declaration
const timerOneTitle = document.getElementById("title1");
const timerTwoTitle = document.getElementById("title2");
const minutes1 = document.getElementById("minutes1");
const seconds1 = document.getElementById("seconds1");
const minutes2 = document.getElementById("minutes2");
const seconds2 = document.getElementById("seconds2");

// Variable declaration
var data = localStorage.getItem("data");
var index = 0;
const ONE_TIMER = false;
const TWO_TIMER = true;

var timerStatus = null;

// Shortcut key
var shortcuts = {
  timerOneToggleKey: "KeyQ",
  timerTwoToggleKey: "KeyW",
  shiftKey: "KeyA",
  nextKey: "Period",
  previousKey: "Comma",
};

const timer1 = new Timer(timerOneTitle, minutes1, seconds1);
const timer2 = new Timer(timerTwoTitle, minutes2, seconds2);

const setupFileInputListener = () => {
  document.getElementById("data").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      data = JSON.parse(await file.text());
      loadDataAtIndex();
    }
  });
};

const setupShortcut = () => {
  document.addEventListener("keydown", (event) => {
    if (event.target !== document.body) return;

    const executeAction = {
      [shortcuts.timerOneToggleKey]: () =>
        toggleTimerBasedOnStatus(timer1, timer2),
      [shortcuts.timerTwoToggleKey]: () =>
        toggleTimerBasedOnStatus(timer2, timer1),
      [shortcuts.nextKey]: () => advanceDataIndex(1),
      [shortcuts.previousKey]: () => advanceDataIndex(-1),
      [shortcuts.shiftKey]: () => toggleBothTimersConditionally(),
    }[event.code];

    if (executeAction) {
      event.preventDefault();
      executeAction();
    }
  });
};

const toggleTimerBasedOnStatus = (primaryTimer, secondaryTimer) => {
  primaryTimer.toggleTimer();
  if (primaryTimer.isRunning) secondaryTimer.stopTimer();
};

const toggleBothTimersConditionally = () => {
  if (timerStatus === TWO_TIMER && (timer1.isRunning || timer2.isRunning))
    [timer1, timer2].forEach((timer) => timer.toggleTimer());
};

const advanceDataIndex = (step) => {
  if (!data || data.length < 0) return;
  index = (index + step + data.length) % data.length;
  [timer1, timer2].forEach((timer) => {
    timer.stopTimer();
    timer.resetTimerSettings();
  });
  loadDataAtIndex();
};

function updateTimer(timer, { title, duration }) {
  timer.title.innerHTML = title;
  timer.duration = duration || 0;
  timer.elapsed = 0;
  timer.updateDisplay(timer.duration * 1000);

  if (timer.isRunning) {
    timer.stopTimer();
    timer.startTimer();
  }
}

const loadDataAtIndex = () => {
  if (!data || index >= data.length) return;

  const {
    type,
    mainTitle,
    title1,
    stance1,
    duration1,
    title2,
    stance2,
    duration2,
  } = data[index];

  timerStatus = type === "timer1" ? ONE_TIMER : TWO_TIMER;

  adjustTimerDisplay(timerStatus === TWO_TIMER);
  updateTimer(timer1, { title: title1, duration: duration1 });
  if (timerStatus === TWO_TIMER) {
    updateTimer(timer2, { title: title2, duration: duration2 });
  }

  if (timerStatus === ONE_TIMER) {
    applyStanceStyle(stance1);
  }

  if (mainTitle) {
    document.getElementById("main-title").style.display = "block";
    console.log(mainTitle);
    document.getElementById("main-title").textContent = mainTitle;
  } else {
    document.getElementById("main-title").style.display = "none";
  }
};

const toggleDisplay = (elementId, displayStyle) => {
  document.getElementById(elementId).style.display = displayStyle;
};

const applyStanceStyle = (stance) => {
  const countdownElement = document.getElementById("countdown");
  countdownElement.classList.remove(
    "no-stance-style",
    "stance1-style",
    "stance2-style"
  );

  switch (stance) {
    case "正方":
      countdownElement.classList.add("stance1-style");
      break;
    case "反方":
      countdownElement.classList.add("stance2-style");
      break;
    case "无":
      countdownElement.classList.add("no-stance-style");
      break;
    default:
      break;
  }
};

const adjustTimerDisplay = (isDualTimer) => {
  const box = document.getElementById("box"); // Assuming the existence of an element with id="box"
  box.classList.toggle("single-countdown", !isDualTimer);
  box.classList.toggle("both-countdowns", isDualTimer);
};

function setupShortcutKeyListener() {
  document.querySelectorAll(".config-input-type").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      event.preventDefault();
      switch (input.id) {
        case "timer-one-toggle-key":
          shortcuts.timerOneToggleKey = event.code;
          localStorage.setItem(
            "timerOneToggleKey",
            shortcuts.timerOneToggleKey
          );
          break;
        case "timer-two-toggle-key":
          shortcuts.timerTwoToggleKey = event.code;
          localStorage.setItem(
            "timerTwoToggleKey",
            shortcuts.timerTwoToggleKey
          );
          break;
        case "next-key":
          shortcuts.nextKey = event.code;
          localStorage.setItem("nextKey", shortcuts.nextKey);
          break;
        case "previous-key":
          shortcuts.previousKey = event.code;
          localStorage.setItem("previousKey", shortcuts.previousKey);
          break;
        case "shift-key":
          shortcuts.shiftKey = event.code;
          localStorage.setItem("shiftKey", shortcuts.shiftKey);
          break;
        default:
          console.error("Unknown config input:", input.id);
      }
    });
  });
}

function setupBackgroundListener() {
  document.getElementById("background").addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      const fileURL = URL.createObjectURL(event.target.files[0]);
      document.body.style.backgroundImage = `url('${fileURL}')`;
      localStorage.setItem("background", fileURL);
    }
  });
}

const initialSetup = () => {
  const keys = [
    "timerOneToggleKey",
    "timerTwoToggleKey",
    "nextKey",
    "previousKey",
    "shiftKey",
    "background",
  ];

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      if (key === "background") {
        document.body.style.background = value;
      } else {
        shortcuts[key] = value;
      }
    }
  });

  const data = localStorage.getItem("data");
  if (data) {
    loadDataAtIndex();
  }
};

initialSetup();
setupFileInputListener();
setupShortcut();
setupShortcutKeyListener();
setupBackgroundListener();
