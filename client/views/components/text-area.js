const m = require('mithril')
const cn = require('classnames')

function textArea(vnode) {
	const {
		oninput = Function.prototype,
		disabled,
		value = '',
		label,
		labelClass
	} = vnode.attrs

	return m('div.mh2', [
		...(label ? [
			m('label', {
				onclick() {
					vnode.dom.querySelector('input').focus()
				},
				className: cn(
					'fw3 green',
					'lui-text-field__label',
					'lui-text-field__label--float-up',
					disabled && 'o-60',
					labelClass
				)
			}, label)
		] : []),
		m('textarea', {
			rows: 2,
			className: cn(
				'input-reset outline-0 ba b--green black-90 pv2 black-90 f4 w-100',
				disabled && 'bg-black-10 b--dashed o-60'
			),
			value,
			disabled,
			oninput(e) {
				const textarea = vnode.dom.querySelector('textarea')
				const lastScrollHeight = vnode.state.lastScrollHeight || textarea.scrollHeight
				let rows = parseInt(textarea.getAttribute('rows'), 10)
				textarea.setAttribute('rows', '2')

				if (rows < 10 && textarea.scrollHeight > lastScrollHeight) {
					rows++
				} else if (rows > 1 && textarea.scrollHeight < lastScrollHeight) {
					rows--
				}

				vnode.state.lastScrollHeight = textarea.scrollHeight
				textarea.setAttribute('rows', rows)
				oninput(e)
			}
		})
	])
}

module.exports = {view: textArea}
