// Script to clear localStorage for testing welcome modal
// Run this in browser console to reset the welcome modal

console.log('Clearing localStorage...');
localStorage.removeItem('hasSeenWelcome');
console.log('hasSeenWelcome removed from localStorage');
console.log('Refresh the page to see the welcome modal again');

// Alternative: Clear all app-related localStorage
/*
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('applyhelper_') || key === 'hasSeenWelcome' || key === 'theme') {
    localStorage.removeItem(key);
    console.log(`Removed: ${key}`);
  }
});
*/