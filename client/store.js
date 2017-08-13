const m = require('mithril')
const {createStore, combineReducers, compose, applyMiddleware} = require('redux')

// Add additional middleware here
const middlewares = [

]

const store = {
	init() {
		const reduce = combineReducers(store.reducers)

		let composeEnhancers = compose

		if (process.env.NODE_ENV === 'development') {
			const loggerSettings = {
				diff: true,
				collapsed: true
			}
			composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
			middlewares.push(require('redux-logger').createLogger(loggerSettings))
		}

		const reduxStore = createStore(
			(state, action) => {
				if (action.type === '$LOAD') {
					return action.state
				}
				return reduce(state, action)
			},
			composeEnhancers(applyMiddleware.apply({}, middlewares))
		)

		if (window.__REDUX_DEVTOOLS_EXTENSION__) {
			reduxStore.subscribe(m.redraw.bind(m))
		}

		// Add the reduxStore methods to the store
		store.dispatch = reduxStore.dispatch.bind(reduxStore)
		store.getState = reduxStore.getState.bind(reduxStore)
		store.subscribe = reduxStore.subscribe.bind(reduxStore)
	}
}

module.exports = store
