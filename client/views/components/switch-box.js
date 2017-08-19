const m = require('mithril')
const cn = require('classnames')
const css = require('sheetify')

css('./switch-box.css')

function switchBox(vnode) {
	let {
		value,
		leftValue,
		leftLabel,
		rightValue,
		rightLabel,
		onswitch
	} = vnode.attrs

	leftLabel = leftLabel || leftValue
	rightLabel = rightLabel || rightValue

	const selectLeft = leftValue === value

	return m('div', {
		className: cn(
			'dib relative mh2'
		),
		onclick() {
			onswitch(
				selectLeft ? rightValue : leftValue
			)
		}
	}, [
		m('div', {
			className: cn(
				'lui-switchbox flex items-center h2 justify-between f6',
				'ba b--green pointer'
			)
		}, [
			m('span', {
				className: cn('pa1', selectLeft ? 'dark-green b' : 'green')
			}, [
				leftLabel
			]),
			m('span', {
				className: cn('pa1', selectLeft ? 'green' : 'dark-green b')
			}, [
				rightLabel
			])
		]),
		m('div', {
			className: cn(
				'lui-switchbox__slider',
				'bg-green o-30 pointer',
				!selectLeft && 'lui-switchbox__slider--right'
			)
		})
	])
}

module.exports = {view: switchBox}
