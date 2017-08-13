const m = require('mithril')
const update = require('immutability-helper')
const store = require('../../store')
const layout = require('../layout')
const textField = require('../components/text-field')
const button = require('../components/button')

const initialState = {
	username: ''
}

const handlers = {
	'login:init': state => {
		return m.mounted ? initialState : state
	},
	'login:setUsername': (state, action) => {
		return update(state, {
			username: {$set: action.value}
		})
	}
}

function reducer(state = initialState, action) {
	return handlers[action.type] ?
		handlers[action.type](state, action) :
		state
}

function oninit() {
	store.dispatch({type: 'login:init'})
}

const actions = {
	signin: ({username}) => {
		return m.request({
			method: 'POST',
			url: '/graphql',
			data: {request: `query {
				token(username: "${username}")
			}`}
		})
			.then(res => {
				store.dispatch({
					type: 'user:login',
					token: res.data.token,
					username
				})

				m.route.set('/')
			})
			.catch(err => {
				window.console.error(err)
			})
	}
}

function login(vnode) {
	const state = store.getState()

	return m(layout, {layoutClass: 'ph2 green'}, [
		m('div.measure.center', [
			m('span.f3.lh-copy.mh2', [
				'Sign in'
			])
		]),
		m('div.mt3.flex.flex-column.flex-row-l.measure.center', [
			m('div.self-center', [
				m(textField, {
					label: 'Username',
					placeholder: 'Development build, so enter whatever',
					value: state.login.username,
					oninput(e) {
						store.dispatch({
							type: 'login:setUsername',
							value: e.target.value
						})
					}
				})
			]),
			m('div.self-center', [
				m(button, {
					disabled: vnode.state.processing,
					buttonType: 'secondary',
					onclick() {
						const done = () => {
							vnode.state.processing = false
						}
						vnode.state.processing = true

						actions.signin({username: state.login.username}).then(done).catch(done)
					}
				}, 'Submit')
			])
		])
	])
}

module.exports = {view: login, oninit, reducer}
