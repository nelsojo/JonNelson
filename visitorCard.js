// visitorCard.js

// No imports needed because Firebase is loaded globally via script tags in your HTML

// Helper: detect OS & browser
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) browser = "Safari";
  if (ua.indexOf("Edge") > -1) browser = "Edge";

  if (ua.indexOf("Win") > -1) os = "Windows";
  if (ua.indexOf("Mac") > -1) os = "MacOS";
  if (ua.indexOf("Linux") > -1) os = "Linux";
  if (/Android/i.test(ua)) os = "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";

  return { browser, os };
}

// Get IPv4 address (forces IPv4)
async function getIPv4() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IPv4:", error);
    return null;
  }
}

// Get IPv6 address (may be null if none)
async function getIPv6() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IPv6:", error);
    return null;
  }
}

(async () => {
  const ipv4 = await getIPv4();
  const ipv6 = await getIPv6();
  const { browser, os } = getDeviceInfo();

  const visitorCard = document.getElementById("visitor-card");
  visitorCard.innerHTML = `
    <h3>Your Info</h3>
    <p><strong>IPv4:</strong> ${ipv4 || "Unavailable"}</p>
    <p><strong>IPv6:</strong> ${ipv6 || "Unavailable"}</p>
    <p><strong>OS:</strong> ${os}</p>
    <p><strong>Browser:</strong> ${browser}</p>
    <p><strong>Location:</strong> Loading...</p>
  `;

  const ipForLocation = ipv4 || ipv6;

  if (ipForLocation) {
    try {
      const locResponse = await fetch(`https://ipapi.co/${ipForLocation}/json/`);
      const locData = await locResponse.json();
      const location = `${locData.city || "?"}, ${locData.region || "?"}, ${locData.country_name || "?"}`;
      visitorCard.querySelector("p:last-of-type").innerHTML = `<strong>Location:</strong> ${location}`;

      // Log visitor info in Firestore (compat syntax)
      firebase.firestore().collection("visitors").add({
        ipv4: ipv4 || null,
        ipv6: ipv6 || null,
        os: os,
        browser: browser,
        location: location,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

    } catch (locError) {
      console.error("Location lookup failed:", locError);
    }
  }
})();
