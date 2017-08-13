const m = require('mithril')
const css = require('sheetify')
const clientId = require('shortid').generate()
const store = require('./store')
const home = require('./views/home')
const login = require('./views/login')
const createEvent = require('./views/create-event')

css('./main.css')

store.reducers = {
	user: require('./state/user'),
	login: login.reducer,
	createEvent: createEvent.reducer
}
store.init()

const appName = 'Challenge'
const development = process.env.NODE_ENV === 'development'
const serverUrl = process.env.SERVER_URL || 'localhost:8080'

function startApp(err) {
	if (err) {
		window.console.error(err)
	}

	m.route(document.getElementById('app'), '/', {
		'/': home,
		'/login': login,
		'/create-event': createEvent
	})

	m.mounted = true

	navigator.geolocation.getCurrentPosition(position => {
		store.dispatch({
			type: 'user:setGeolocation',
			value: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
		})
		m.redraw()
	}, error => {
		if (error.code === error.PERMISSION_DENIED) {
			store.dispatch({
				type: 'user:setGeolocationDenied',
				value: true
			})
			m.redraw()
		}
	})

	const ws = new WebSocket('ws://' + (development ? serverUrl : window.location.host))

	ws.onopen = function () {
	}
}

// Wrap request to hit local host
m.request = (function (mRequest) {
	return function (opts) {
		const state = store.getState()
		if (opts.url[0] === '/' && development) {
			opts.url = 'http://' + serverUrl + opts.url
		}
		if (opts.data) {
			opts.data.clientId = clientId
		}
		if (state.user.token) {
			opts.headers = {Authorization: `Bearer ${state.user.token}`}
		}
		return mRequest.call(m, opts)
	}
})(m.request)

if (development) {
	require('./utils/localforage')(appName, store, startApp)
} else {
	startApp()
}
