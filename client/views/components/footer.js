const m = require('mithril')

function footer() {
	return m('div.bg-green.white.pa1.fixed.f7.left-0.bottom-0.right-0', [
		m('div', {
			innerHTML: '<div>Icons made by <a class="link white underline b" href="http://www.freepik.com" title="Freepik">Freepik</a> from <a class="link white underline b" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a class="link white underline b" href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>'
		})
	])
}

module.exports = {view: footer}
