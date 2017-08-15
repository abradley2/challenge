const m = require('mithril')
const cn = require('classnames')
const Pickaday = require('pikaday')
const css = require('sheetify')

css('pikaday/css/pikaday.css')
css('./datepicker')

function oncreate(vnode) {
	const host = vnode.dom.querySelector('input')

	vnode.state.picker = new Pickaday({
		field: host,
		format: 'MMMM D',
		onSelect(date) {
			vnode.attrs.onselect(date)
			m.redraw()
		}
	})
}

function datepicker(vnode) {
	const {
		value = '',
		disabled,
		placeholder,
		inputClass,
		label,
		labelClass
	} = vnode.attrs

	return m('div.dib.mh2', [
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
			}, [
				label,
				m('i.pl2.fa.fa-calendar-o')
			])
		] : []),
		m('input', {
			className: cn(
				'lui-text-field__input',
				'input-reset outline-0 br-0 bl-0 bt-0 bb b--green black-90 pv2 black-90 f4 mw5',
				disabled && 'bg-black-10 b--dashed o-60',
				inputClass
			),
			value,
			placeholder: vnode.state.hasFocus ? '' : placeholder,
			oninput() {

			}
		})
	])
}

module.exports = {view: datepicker, oncreate}
