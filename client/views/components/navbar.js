const m = require('mithril')

function navItem({icon, label, href, onclick}) {
	const el = href ? 'a' : 'span'

	return m(el + '.dt.ph2.ph3-l.h-100.white.link.pointer', {href, onclick}, [
		m('div.dtc.v-mid.tc.ph1', [
			m('div.flex.justify-center.items-center.bg-white-50.h-100.w2', [
				m(`i.f3.fa.fa-${icon}`)
			])
		]),
		label ? m('div.dn.dtc-l.v-mid.ph1.f5', [
			label
		]) : null
	])
}

function navbar(vnode) {
	const {
		loggedIn,
		onclicklogout
	} = vnode.attrs

	const loggedInNav = [
		navItem({icon: 'plus', label: 'Create event', href: '#!/create-event'}),
		navItem({icon: 'sign-out', label: 'Logout', onclick: onclicklogout})
	]

	const loggedOutNav = [
		navItem({icon: 'sign-in', label: 'Login', href: '#!/login'})
	]

	return m('div.shadow-1.flex.justify-between.fixed.top-0.left-0.right-0.h3.bg-green.white-90', [
		m('div.flex', [
			navItem({icon: 'home', label: 'Home', href: '#!/'})
		]),
		m('div.flex', [
			navItem({icon: 'search', label: 'Find event', href: '#!/'})
		].concat(loggedIn ? loggedInNav : loggedOutNav))
	])
}

module.exports = {view: navbar}
