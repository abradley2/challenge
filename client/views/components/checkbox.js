const m = require('mithril')
const css = require('sheetify')
const cn = require('classnames')

css('./checkbox.css')

function checkbox(vnode) {
	const {
		label = '',
		value = false,
		onchange = Function.prototype
	} = vnode.attrs

	return m('div.dib.bb.b--green.mh2', {
		onclick() {
			onchange(!value)
		}
	}, [
		m('div.lui-checkbox.pointer.flex.items-center', [
			m('div.ba.b--green', [
				m('i', {
					className: cn(
						'pa1 fa f3 fa-check lui-checkbox__check',
						value ? 'green' : 'white'
					)
				})
			]),
			m('span.ph2.green', [
				label,
				m('i', {
					className: cn(
						'fa fa-check lui-checkbox__check',
						!value && 'o-30'
					)
				})
			])
		])
	])
}

module.exports = {view: checkbox}
