const m = require('mithril')
const cn = require('classnames')
const switchBox = require('./switch-box')

function padLeft(num) {
	if (num.toString().length === 1) {
		return `0${num}`
	}
	return num
}

const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0))
const dateString = date.toLocaleTimeString()
const twelveHour = Boolean(dateString.match(/am|pm/i) || date.toString().match(/am|pm/i))

function oninit(vnode) {
	Object.assign(vnode.state, {
		twelveHour,
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
		labelClass
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
			m(switchBox, {
				leftValue: 'AM',
				rightValue: 'PM',
				value: vnode.state.am ? 'AM' : 'PM',
				onswitch(otherVal) {
					vnode.state.am = (otherVal === 'AM')
				}
			})
		])
	])
}

module.exports = {view: timepicker, oninit}
