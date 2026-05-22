// Background service worker
// Handles extension-wide events and messaging

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'popup.html' });
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    sendResponse({ status: 'ok' });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.action.setPopup({ popup: 'popup.html' });
});
