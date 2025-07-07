let logoutTimer = null;
let alertTimeout = null;
let countdownInterval = null;
let countdown = 60;

const inactivityLimit = 14.1 * 60 * 1000;
const alertDuration = 60 * 1000;       

function createLogoutPopup() {
  // Jeśli popup już jest, nie dodaj ponownie
  if (document.getElementById('logout-popup')) return;
  
  const popup = document.createElement('div');
  popup.id = 'logout-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px 30px';
  popup.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = 99999;
  popup.style.width = '320px';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.textAlign = 'center';

  popup.innerHTML = `
    <h2 style="margin-top:0; color:#d9534f;">Uwaga!</h2>
    <p style="color: #000;">Zostaniesz wylogowany za <span id="logout-countdown">60</span> sekund z powodu braku aktywności.</p>
    <button id="cancel-logout-btn" style="
      background-color: #5cb85c;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 15px;
    ">Anuluj wylogowanie</button>
  `;

  document.body.appendChild(popup);

  // Obsługa kliknięcia anulowania
  document.getElementById('cancel-logout-btn').addEventListener('click', () => {
    cancelLogout();
  });
}

function removeLogoutPopup() {
  const popup = document.getElementById('logout-popup');
  if (popup) {
    popup.remove();
  }
}

function updateCountdown() {
  const countdownElem = document.getElementById('logout-countdown');
  if (countdownElem) {
    countdownElem.textContent = countdown.toString();
  }
}

function startLogoutCountdown() {
  countdown = 60;
  createLogoutPopup();
  updateCountdown();

  countdownInterval = setInterval(() => {
    countdown--;
    updateCountdown();

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      performLogout();
    }
  }, 1000);
}

function performLogout() {3
  removeLogoutPopup();

  const logoutButton = document.querySelector('.xs-toolbar-hamburger-menu-element[ng-click="logout(\'hamburger menu click\');"]');
  logoutButton?.click();
}

function cancelLogout() {
  clearTimeout(logoutTimer);
  clearTimeout(alertTimeout);
  clearInterval(countdownInterval);
  removeLogoutPopup();
  scheduleLogoutWarning();
}

function scheduleLogoutWarning() {
  alertTimeout = setTimeout(() => {
    startLogoutCountdown();

  
    logoutTimer = setTimeout(() => {
      performLogout();
    }, alertDuration);
  }, inactivityLimit);
}

function resetTimers() {
  clearTimeout(alertTimeout);
  clearTimeout(logoutTimer);
  clearInterval(countdownInterval);
  removeLogoutPopup();
  scheduleLogoutWarning();
}

document.addEventListener('click', () => {
  chrome.runtime.sendMessage("extendCookie");
  resetTimers();
});

scheduleLogoutWarning();
