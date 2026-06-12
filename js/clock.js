const timeElement = document.getElementById("time");
const rotatingLabelElement = document.getElementById("rotatingLabel");

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

let currentLabelIndex = 0;

function applyTheme() {
  document.body.setAttribute(
    "data-theme",
    CLOCK_CONFIG.theme || "asteria-lavender",
  );
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function getClockParts(date) {
  const formatter = new Intl.DateTimeFormat("en-US-u-nu-latn", {
    timeZone: CLOCK_CONFIG.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return {
    hour24: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function formatDigitalTime(parts) {
  return `${pad(parts.hour24)}:${pad(parts.minute)}:${pad(parts.second)}`;
}

function updateAnalogClock(parts) {
  const hourDeg = ((parts.hour24 % 12) + parts.minute / 60) * 30;
  const minuteDeg = (parts.minute + parts.second / 60) * 6;
  const secondDeg = parts.second * 6;

  hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat(CLOCK_CONFIG.locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: CLOCK_CONFIG.timeZone,
  }).format(date);
}

function formatChannelLabel() {
  return `${CLOCK_CONFIG.channelPrefix} · ${CLOCK_CONFIG.channelName}`;
}

function getLabelText(date) {
  if (currentLabelIndex === 0) {
    return formatDateLabel(date);
  }

  return formatChannelLabel();
}

function changeLabel(nextText) {
  if (rotatingLabelElement.textContent === nextText) {
    return;
  }

  rotatingLabelElement.classList.add("is-exiting");

  window.setTimeout(() => {
    rotatingLabelElement.textContent = nextText;

    rotatingLabelElement.classList.remove("is-exiting");
    rotatingLabelElement.classList.add("is-entering");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rotatingLabelElement.classList.remove("is-entering");
      });
    });
  }, CLOCK_CONFIG.labelTransitionMs || 320);
}

function updateClock() {
  const now = new Date();
  const parts = getClockParts(now);

  timeElement.textContent = formatDigitalTime(parts);
  updateAnalogClock(parts);
}

function updateLabelInstantly() {
  const now = new Date();
  rotatingLabelElement.textContent = getLabelText(now);
}

function startLabelRotation() {
  window.setInterval(() => {
    currentLabelIndex = currentLabelIndex === 0 ? 1 : 0;

    const now = new Date();
    const nextLabel = getLabelText(now);

    changeLabel(nextLabel);
  }, CLOCK_CONFIG.labelIntervalMs);
}

applyTheme();

updateClock();
updateLabelInstantly();

window.setInterval(updateClock, 1000);
startLabelRotation();
