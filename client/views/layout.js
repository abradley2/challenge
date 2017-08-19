const m = require('mithril')
const cn = require('classnames')
const store = require('../store')
const navbar = require('./components/navbar')
const footer = require('./components/footer')

function layout(vnode) {
	const state = store.getState()
	const {
		layoutClass = ''
	} = vnode.attrs

	return m('div.pb5', {
		className: cn(
			'sans-serif avenir',
			layoutClass
		)
	}, [
		m(navbar, {
			loggedIn: Boolean(state.user.token),
			onclicklogout() {
				store.dispatch({
					type: 'user:logout'
				})
			}
		}),
		...vnode.children,
		m(footer)
	])
}

module.exports = {view: layout}
