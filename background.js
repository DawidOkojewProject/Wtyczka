function alertNotification(message) {
	chrome.notifications.create({
		type: 'basic',
		// iconUrl: 'icon.png',
		title: 'Alert reminder',
		message: message,
		priority: 3,
	})
}

//Listen for alerts to ack
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'showNotification') {
		alertNotification(message.message)
	}
})
