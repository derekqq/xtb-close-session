const watchedDomain = "xstation5.xtb.com";
const cookieDomain = "xstation5.xtb.com";
const cookieName = "CASTGC";
const extraTime = 15 * 60; 

function extendCookie() {
  chrome.cookies.get({ url: `https://${cookieDomain}`, name: cookieName }, (cookie) => {
    if (!cookie) {
      console.log(`Cookie ${cookieName} nie znaleziono w domenie ${cookieDomain}.`);
      return;
    }
    console.log("Znaleziono cookie:", cookie);

    const now = new Date();
    const newExpirationDate = Math.floor(now.getTime() / 1000) + extraTime;

    const cookiePath = cookie.path ? cookie.path : "/";

    chrome.cookies.set({
      url: `https://${cookieDomain}${cookiePath}`,
      name: cookie.name,
      value: cookie.value,
      expirationDate: newExpirationDate,
      domain: cookie.domain,
      path: cookiePath,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error(`Błąd przy ustawianiu ciasteczka ${cookieName}:`, chrome.runtime.lastError);
      } else {
        console.log(`Wydłużono ważność ciasteczka ${cookieName} do ${new Date(newExpirationDate * 1000)}`);
      }
    });
  });
}

chrome.webNavigation.onCompleted.addListener(details => {
  if (details.url.startsWith(`https://${watchedDomain}`)) {
    setTimeout(() => {
      extendCookie();
    }, 5000);
  }
}, { url: [{ hostEquals: watchedDomain }] });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "extendCookie") {
    extendCookie();
  }
});
