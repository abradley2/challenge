const m = require('mithril')
const cn = require('classnames')
const switchBox = require('./switch-box')

function padLeft(num) {
	const n = parseInt(num, 10)
	if (n.toString().length === 1) {
		return `0${n}`
	}
	return n
}

function toTwentyFourHours(hour, am) {
	const hr = parseInt(hour, 10)
	if (am) {
		if (hr === 12) {
			return 0
		}
		return hr
	}
	if (hr === 12) {
		return 12
	}
	return 12 + hr
}

function oninit(vnode) {
	Object.assign(vnode.state, {
		twelveHour: true,
		am: true
	})
}

function oncreate(vnode) {
	vnode.dom.querySelectorAll('input').forEach(field => {
		field.onfocus = function () {
			this.value = ''
		}
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
		validationText = '',
		onchange = Function.prototype
	} = vnode.attrs

	const resetInputs = () => {
		const inputs = vnode.dom.querySelectorAll('input')

		inputs[0].value = hours
		inputs[1].value = minutes
	}

	const formatInputs = ({hours, minutes}) => {
		const inputs = vnode.dom.querySelectorAll('input')
		inputs[0].value = padLeft(hours)
		inputs[1].value = padLeft(minutes)
	}

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
				placeholder: vnode.state.hasFocus ? '' : placeholder,
				onchange(e) {
					if (Number.isNaN(Number(e.target.value))) {
						resetInputs()
						return
					}
					if (Number(e.target.value) > 24) {
						resetInputs()
						onchange({hours, minutes})
					}
					if (Number(e.target.value) > 12 && vnode.state.twelveHour) {
						resetInputs()
						onchange({hours, minutes})
					}

					const value = {
						hours: vnode.state.twelveHour	?
							toTwentyFourHours(e.target.value, vnode.state.am) :
							e.target.value,
						minutes
					}
					onchange(value)
					formatInputs({
						hours: e.target.value,
						minutes
					})
				}
			}),
			m('span.self-center', ':'),
			m('input', {
				className: cn(
					'lui-text-field__input',
					'input-reset outline-0 br-0 bl-0 bt-0 bb b--green black-90 pv2 black-90 f4 w3 tc',
					disabled && 'bg-black-10 b--dashed o-60',
					inputClass
				),
				placeholder: vnode.state.hasFocus ? '' : placeholder,
				onchange(e) {
					if (Number.isNaN(Number(e.target.value))) {
						resetInputs()
						return
					}
					if (Number(e.target.value) > 59) {
						resetInputs()
						return
					}
					onchange({
						hours,
						minutes: e.target.value
					})
				}
			}),
			m('div.relative', [
				m('div.pointer.absolute.top--1.f7.green.w4.underline.ph2', {
					onclick() {
						vnode.state.twelveHour = !vnode.state.twelveHour
						if (vnode.state.twelveHour && Number(hours) > 12) {
							const value = {
								hours: hours - 12,
								minutes
							}
							formatInputs(value)
							onchange(value)
						}
					}
				}, [
					vnode.state.twelveHour ?
						'Switch 24 hour' :
						'Switch 12 hour'
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

module.exports = {view: timepicker, oninit, oncreate}
