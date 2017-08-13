const m = require('mithril')
const cn = require('classnames')
const css = require('sheetify')

css('./select-menu.css')

document.addEventListener('click', e => {
	let node = e.target.parentNode
	if (!node) {
		return
	}
	while (node) {
		if (node.onoutsideclick) {
			let closed = false
			document.querySelectorAll('[data-onoutsideclick]').forEach(n => {
				if (n !== node) {
					n.onoutsideclick()
					closed = true
				}
			})
			if (closed) {
				m.redraw()
			}
			break
		}
		if (node === document) {
			document.querySelectorAll('[data-onoutsideclick]').forEach(n => {
				n.onoutsideclick()
			})
			m.redraw()
			break
		}
		node = node.parentNode
	}
})

function oncreate(vnode) {
	vnode.dom.onoutsideclick = function () {
		vnode.state.open = false
	}
}

function selectMenu(vnode) {
	const {
		label,
		value = '',
		options,
		disabled,
		onselect = Function.prototype,
		validationText = '',
		labelClass,
		inputClass
	} = vnode.attrs

	return m('div.dib.lui-text-field.relative.mh2', {'data-onoutsideclick': true}, [
		m('div.pointer.relative', [
			...(label ? [
				m('label', {
					className: cn(
						'fw3 green',
						'lui-text-field__label',
						(vnode.state.open || value) ?
							'lui-text-field__label--float-up' :
							'underline',
						disabled && 'o-60',
						labelClass
					)
				}, [
					label,
					m('i.pl2.fa.fa-caret-down')
				])
			] : []),
			m('input', {
				value,
				className: cn(
					'input-reset outline-0 br-0 bl-0 bt-0 bb b--green black-90 pv2 black-90 f4 mw5',
					disabled && 'bg-black-10 b--dashed o-60',
					inputClass
				),
				onfocus(e) {
					e.target.blur()
					if (disabled) {
						return
					}
					vnode.state.open = true
				}
			}),
			m('div.absolute.top-0.bottom-0.right-0.left-0.pointer', {
				onclick() {
					if (disabled) {
						return
					}
					vnode.state.open = !vnode.state.open
				}
			})
		]),
		m('div.h1.f6.orange', validationText),
		m('div', {
			className: cn(
				'lui-select-menu__menu',
				vnode.state.open && 'lui-select-menu__menu--open',
				vnode.state.open && 'bg-white z-1 shadow-1'
			)
		}, options.map(opt => {
			return m('div.flex.ph2.pv3.pointer.hover-bg-black-10', {
				onclick() {
					onselect(opt)
					vnode.state.open = false
				}
			}, opt.label)
		}))
	])
}

module.exports = {view: selectMenu, oncreate}
