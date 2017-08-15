const m = require('mithril')
const cn = require('classnames')
const update = require('immutability-helper')
const store = require('../../store')
const {formatDate} = require('../../utils/date')
const layout = require('../layout')
const geoAsk = require('../patterns/geo-ask')
const textField = require('../components/text-field')
const datepicker = require('../components/datepicker')

const initialState = {
	eventName: '',
	eventTags: '',
	eventStart: null
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
			m(datepicker, {
				label: 'Day of event',
				onselect(date) {
					store.dispatch({
						type: 'createEvent:setField',
						field: 'eventStart',
						value: date.valueOf()
					})
				},
				value: state.createEvent.eventStart ?
					formatDate(new Date(state.createEvent.eventStart)) :
					''
			})
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
