const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");

const settings = {
  use24Hour: true,
  showSeconds: true,
  locale: "en-US",
  timeZone: undefined,
};

function updateClock() {
  const now = new Date();

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !settings.use24Hour,
    timeZone: settings.timeZone,
  };

  if (settings.showSeconds) {
    timeOptions.second = "2-digit";
  }

  const dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: settings.timeZone,
  };

  timeElement.textContent = new Intl.DateTimeFormat(
    settings.locale,
    timeOptions,
  ).format(now);

  dateElement.textContent = new Intl.DateTimeFormat(
    settings.locale,
    dateOptions,
  ).format(now);
}

updateClock();
setInterval(updateClock, 1000);
