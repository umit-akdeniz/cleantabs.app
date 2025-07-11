// Clear all cookies for localhost
console.log('Clearing all cookies...');

// Get all cookies
const cookies = document.cookie.split(";");

// Clear each cookie
cookies.forEach(cookie => {
  const eqPos = cookie.indexOf("=");
  const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
  if (name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
});

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();

console.log('All cookies and storage cleared');
console.log('Please refresh the page');