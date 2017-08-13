const m = require('mithril')
const store = require('../../store')
const layout = require('../layout')
const geoAsk = require('../patterns/geo-ask')

function homeView() {
	const state = store.getState()

	return m(layout, {layoutClass: 'ph2 green'}, [
		m('div.measure.center.flex.items-center.justify-center.relative', [
			m('img[src="assets/icons/boxing-person.svg"].mw4'),
			m('span.f2', 'Challenge')
		]),
		m('div.measure.center.pv3', [
			m(geoAsk, {
				geolocation: state.user.geolocation,
				geolocationDenied: state.user.geolocationDenied,
				onsuccess(geolocation) {
					store.dispatch({
						type: 'user:setGeolocation',
						value: geolocation
					})
				}
			})
		])
	])
}

module.exports = {view: homeView}
