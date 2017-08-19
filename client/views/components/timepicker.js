const m = require('mithril')
const cn = require('classnames')
const switchBox = require('./switch-box')

function padLeft(num) {
	if (num.toString().length === 1) {
		return `0${num}`
	}
	return num
}

function oninit(vnode) {
	Object.assign(vnode.state, {
		twelveHour: true,
		am: true
	})
}

function timepicker(vnode) {
	const {
		hours = 12,
		minutes = 0,
		disabled,
		placeholder,
		inputClass,
		label,
		labelClass,
		validationText = ''
	} = vnode.attrs

	return m('div.lui-text-field.dib.relative.mh2.pv2', [
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
				m('i.pl2.fa.fa-clock-o')
			])
		] : []),
		m('div.flex.w5', [
			m('input', {
				className: cn(
					'lui-text-field__input',
					'input-reset outline-0 br-0 bl-0 bt-0 bb b--green black-90 pv2 black-90 f4 w3 tc',
					disabled && 'bg-black-10 b--dashed o-60',
					inputClass
				),
				value: padLeft(hours),
				placeholder: vnode.state.hasFocus ? '' : placeholder
			}),
			m('span.self-center', ':'),
			m('input', {
				className: cn(
					'lui-text-field__input',
					'input-reset outline-0 br-0 bl-0 bt-0 bb b--green black-90 pv2 black-90 f4 w3 tc',
					disabled && 'bg-black-10 b--dashed o-60',
					inputClass
				),
				value: padLeft(minutes),
				placeholder: vnode.state.hasFocus ? '' : placeholder
			}),
			m('div.relative', [
				m('div.pointer.absolute.top--1.f7.green.w4.underline.ph2', {
					onclick() {
						vnode.state.twelveHour = !vnode.state.twelveHour
					}
				}, [
					vnode.state.twelveHour ?
						'24 hour format' :
						'12 hour format'
				]),
				vnode.state.twelveHour ? m(switchBox, {
					leftValue: 'AM',
					rightValue: 'PM',
					value: vnode.state.am ? 'AM' : 'PM',
					onswitch(otherVal) {
						vnode.state.am = (otherVal === 'AM')
					}
				}) : null
			])
		]),
		m('div.h1.f6.orange', validationText)
	])
}

module.exports = {view: timepicker, oninit}
