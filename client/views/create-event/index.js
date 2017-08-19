const m = require('mithril')
const cn = require('classnames')
const update = require('immutability-helper')
const startOfTomorrow = require('date-fns/start_of_tomorrow')
const store = require('../../store')
const {formatDate} = require('../../utils/date')
const layout = require('../layout')
const geoAsk = require('../patterns/geo-ask')
const textField = require('../components/text-field')
const datepicker = require('../components/datepicker')
const timepicker = require('../components/timepicker')

const startDate = startOfTomorrow(new Date())

const initialState = {
	eventName: '',
	eventTags: '',
	eventStartDate: startDate.toISOString(),
	eventStartTime: ''
}

const handlers = {
	'createEvent:setField': (state, action) => {
		return update(state, {
			[action.field]: {$set: action.value}
		})
	}
}

function reducer(state = initialState, action) {
	return handlers[action.type] ?
		handlers[action.type](state, action) :
		state
}

function createEvent() {
	const state = store.getState()

	const eventStartDate = new Date(state.createEvent.eventStartDate)

	const rowContainer = cn(
		'flex flex-wrap',
		'flex-column items-center justify-end',
		'measure-wide-l center-l flex-row-l items-start-l justify-start-l'
	)

	return m(layout, {layoutClass: 'ph2'}, [
		m('div', {className: rowContainer}, [
			m('div', [
				m(textField, {
					label: 'Event Name',
					value: state.createEvent.eventName,
					oninput(e) {
						store.dispatch({
							type: 'createEvent:setField',
							field: 'eventName',
							value: e.target.value
						})
					}
				})
			]),
			m('div.relative', [
				m(textField, {
					label: 'Tags',
					value: state.createEvent.eventTags,
					placeholder: 'Seperate , tags , by , commas ,',
					oninput(e) {
						store.dispatch({
							type: 'createEvent:setField',
							field: 'eventTags',
							value: e.target.value
						})
					}
				}),
				m('div.flex.flex-wrap.mw5.mh2',
					state.createEvent.eventTags.split(',').map(tag => {
						if (!tag) {
							return null
						}
						return m('span', {
							className: 'blue f5 tu pa1 mr2 mb1 ba b--blue'
						}, tag)
					})
				)
			])
		]),
		m('div', {
			className: cn(rowContainer, 'mt5')
		}, [
			m('div', [
				m(datepicker, {
					label: 'Day of event',
					onselect(date) {
						store.dispatch({
							type: 'createEvent:setField',
							field: 'eventStartDate',
							value: date.valueOf()
						})
					},
					value: state.createEvent.eventStartDate ?
						formatDate(eventStartDate) :
						''
				})
			]),
			m('div', [
				m(timepicker, {
					label: 'Time of event',
					hours: eventStartDate.getHours(),
					minutes: eventStartDate.getMinutes(),
					onchange({hours, minutes}) {
						const date = new Date(state.createEvent.eventStartDate)

						date.setHours(hours)
						date.setMinutes(minutes)

						store.dispatch({
							type: 'createEvent:setField',
							field: 'eventStartDate',
							value: date.valueOf()
						})
					}
				})
			])
		]),
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
}

module.exports = {view: createEvent, reducer}
