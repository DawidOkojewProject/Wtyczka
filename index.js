const redirectURL = 'https://enetproduction.atlassian.net/wiki/search?text='

function handleClick(event) {
	event.preventDefault()
	const alertName = event.target
		.closest('.og-alert-item')
		.querySelector('.og-alert-item__main__title-box__title').innerText
	window.open(redirectURL + encodeURIComponent(alertName), '_blank')
}

function addPlaybookLink(alert) {
	// Sprawdź, czy 'Playbook' już istnieje
	if (!alert.querySelector('.playbook-link')) {
		const text = document.createElement('button')
		text.classList.add('playbook-link') // Umożliwia identyfikację, że 'Playbook' został dodany
		text.classList.add('alert-button')
		text.style.borderRadius = '3px'
		text.textContent = 'Playbook'
		text.addEventListener('click', handleClick)
		const item2 = alert.querySelector('.og-alert-item__main__team-box__item')

		item2.after(text) // Dodaj 'Playbook' do alertu
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

//Autorefresher
turnAutoRefresherOn((timeInMilis = 5000))

function turnAutoRefresherOn(timeInMilis) {
	function refresh() {
		// Find button with the appropriate selector to click
		const button = document.querySelector('.og-saved-search__list__section__content__item--active')
		if (button) {
			button.click()
		}
	}

	// Set up an interval to click the button every 10 seconds
	setInterval(refresh, timeInMilis)
}
