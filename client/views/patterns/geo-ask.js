const m = require('mithril')
const button = require('../components/button')

function geoAsk(vnode) {
	const {
		onsuccess,
		geolocation,
		geolocationDenied
	} = vnode.attrs

	if (!navigator.geolocation) {
		return m('div', [
			`
			Sorry, your geolocation is not supported by your browser.
			Geolocation is required to support many features of Challenge
			`
		])
	}

	if (geolocation) {
		return null
	}

	if (geolocationDenied) {
		return m('div.shadow-2.tc.pa3', [
			m('span.f5', {
				innerHTML: `
					This application has been denied geolocation access :(
					<br />
					Please enable access so we can find tournaments near you.
				`
			})
		])
	}

	return m('div.shadow-2.tc.pa3', [
		m('span.f5', [
			`
			So that events may be properly scoped by location, please allow
			this application access your GeoLocation.
			`
		]),
		m('br'),
		m('span.orange.f6', 'Your location information is not shared with other users'),
		m('br'),
		m('div.tc', [
			m(button, {
				buttonType: 'secondary',
				onclick() {
					navigator.geolocation.getCurrentPosition(
						position => {
							onsuccess({
								lat: position.coords.latitude,
								lng: position.coords.longitude
							})
							m.redraw()
						},
						err => {
							if (err) {
								vnode.state.err = err
							}
							m.redraw()
						}
					)
				}
			}, 'Request Location')
		])
	])
}

module.exports = {view: geoAsk}
