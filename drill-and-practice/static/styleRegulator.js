const closeAlert = () => {
	const alertElement = document.querySelector('.alert')
	if (alertElement) {
		const parentElement = alertElement.parentNode
		parentElement.removeChild(alertElement)
	}
}
