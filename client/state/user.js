const update = require('immutability-helper')

const initialState = {
	username: null,
	token: null,
	geolocation: null,
	geolocationDenied: false
}

const handlers = {
	'user:login': (state, action) => {
		return update(state, {
			username: {$set: action.username},
			token: {$set: action.token}
		})
	},
	'user:logout': state => {
		return update(state, {
			$merge: {
				username: null,
				token: null
			}
		})
	},
	'user:setGeolocation': (state, action) => {
		return update(state, {
			geolocation: {$set: action.value},
			geolocationDenied: {$set: false}
		})
	},
	'user:setGeolocationDenied': state => {
		return update(state, {
			geolocation: {$set: null},
			geolocationDenied: {$set: true}
		})
	}
}

function user(state = initialState, action) {
	return handlers[action.type] ?
		handlers[action.type](state, action) :
		state
}

module.exports = user
