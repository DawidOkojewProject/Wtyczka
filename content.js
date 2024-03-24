const redirectURL = 'https://enetproduction.atlassian.net/wiki/search?text='

function handleClick(event) {
	event.preventDefault()
	const alertName = event.currentTarget
		.closest('.og-alert-item')
		.querySelector('.og-alert-item__main__title-box__title').innerText
	window.open(redirectURL + encodeURIComponent(alertName), '_blank')
	const list = document.querySelector('ul li')
	console.log(list)
}

function addPlaybookLink(alert) {
	// Sprawdź, czy 'Playbook' już istnieje
	if (!alert.querySelector('.playbook-link')) {
		const text = document.createElement('button')
		text.classList.add('playbook-link')
		// Umożliwia identyfikację, że 'Playbook' został dodany
		text.classList.add('alert-button')
		text.style.borderRadius = '3px'
		text.textContent = 'Playbook'
		text.addEventListener('click', handleClick)
		const item2 = alert.querySelector('.og-alert-item__main__team-box__item')
		item2.after(text)
		// Dodaj 'Playbook' do alertu
	}
}

function addPlaybookToExistingAlerts() {
	document.querySelectorAll('.og-alert-item').forEach(addPlaybookLink)
}

function onElementAvailable(selector) {
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				// Sprawdź, czy dodany węzeł lub jego potomkowie pasują do selektora
				if (node.nodeType === 1) {
					// ELEMENT_NODE
					if (node.matches(selector)) {
						addPlaybookLink(node)
					}
					node.querySelectorAll(selector).forEach(addPlaybookLink)
				}
			})
		})
	})
	observer.observe(document.body, { childList: true, subtree: true })
}

// Dodaj 'Playbook' do istniejących alertów i obserwuj nowe
addPlaybookToExistingAlerts()
onElementAvailable('.og-alert-item')

turnAutoRefresherOn(10000) //Autorefresher

function turnAutoRefresherOn(timeInMilis) {
	function refresh() {
		checkIfAlertIsNotAcked()
		const button = document.querySelector('.og-saved-search__list__section__content__item--active')
		if (button) {
			button.click()
		}
	}
	// Set up an interval for refresh
	setInterval(refresh, timeInMilis)
}

//Alert Reminder
function checkIfAlertIsNotAcked() {
	const elements = document.querySelectorAll('.og-alert-item')
	elements.forEach(element => {
		const openAlertClassElement = element.querySelector('.og-lozenge--bold--red')
		if (openAlertClassElement) {
			const alertElapsedTime = element.querySelector('.time-stamp').innerText
			if (calculateElapsedTime(alertElapsedTime) > 0) {
				soundAlert()
				// chrome.runtime.sendMessage({ action: 'showNotification', message: 'Alert do zaackowania' })
			}
		}
	})
}

//Time calculation
function calculateElapsedTime(dateString) {
	const date = new Date(dateString)
	const currentTime = new Date()
	const difference = currentTime - date
	const minutesDifference = difference / (1000 * 60)
	return minutesDifference
}

//Sound alert
function soundAlert() {
	const context = new AudioContext()
	const oscillator = context.createOscillator()
	oscillator.type = 'sine'
	oscillator.frequency.value = 800
	oscillator.connect(context.destination)
	oscillator.start()
	// Beep for 500 milliseconds
	setTimeout(function () {
		oscillator.stop()
	}, 500)
}

console.log('wtyczka działa')
