const $inputRange = document.querySelector("#input-range");
const $countCharacters = document.querySelector("#count-characters");
const $formData = document.querySelector("#form-data");
const $passwordCurrent = document.querySelector("#password-current");
const $levelSecurity = document.querySelector("#level-security");
const $settingsList = document.querySelectorAll("input[name='settings-list'");
const $containeAlerts = document.querySelector("#containe-alerts");
const groupSettings = {
  UPPER_CASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWER_CASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
  SYMBOLS: "!@#$.+-",
};
let RANDOM_PASSWORD = "";
let key = 0;

async function init() {
  $inputRange.addEventListener("input", renderCountCharacters);
  function renderCountCharacters({ target }) {
    $countCharacters.textContent = target.value;
  }
}

$formData.addEventListener("submit", handleSubmit);
function handleSubmit(e) {
  e.preventDefault();
  const formData = { ...Object.fromEntries(new FormData(this)) };
  if (Number(formData.countCharacters) <= 0 || Object.keys(formData).length < 2) {
    resetForm();
    return;
  }
  generatePassword(formData);
}

function generatePassword({ countCharacters, ...settings }) {
  RANDOM_PASSWORD = "";
  const settingsList = Object.keys(settings);
  const getCharacter = (characters) => characters[Math.floor(Math.random() * characters.length)];
  for (let i = 0; i < countCharacters; i++) {
    const keySetting = settingsList[Math.floor(Math.random() * settingsList.length)];
    const characters = groupSettings[settings[keySetting]];
    const chart = getCharacter(characters);
    RANDOM_PASSWORD += chart;
  }
  $passwordCurrent.textContent = RANDOM_PASSWORD;
  $levelSecurity.dataset.level = settingsList.length;
}

function resetForm() {
  $levelSecurity.dataset.level = 0;
  $passwordCurrent.textContent = "-";
  RANDOM_PASSWORD = "";
}

function copyText() {
  const text = $passwordCurrent.textContent;
  if (!navigator.clipboard || text.length === 0 || text === "-") return;
  navigator.clipboard
    .writeText(text)
    .then(showAlert)
    .catch((error) => {
      console.error("Not copied");
    });
}

function showAlert() {
  const TEMPLATE = createAlert();
  $containeAlerts.appendChild(TEMPLATE);
  setTimeout(() => {
    TEMPLATE.remove();
  }, 6000);
}

function createAlert() {
  const alertContainer = document.createElement("div");
  alertContainer.classList.add("alert", "alert__success");
  alertContainer.setAttribute("key", key);
  alertContainer.innerHTML = `
    <img class="alert__icon" src="./icons/check.svg" alt="" />
    <div class="alert__content">
      <p>Contraseña copiada al portapapeles.</p>
    </div>
  `;
  key += 1;
  return alertContainer;
}

init();
