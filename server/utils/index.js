exports.deferred = function () {
	let _resolve
	let _reject
	const promise = new Promise((resolve, reject) => {
		_resolve = resolve
		_reject = reject
	})

	return {
		resolve: _resolve,
		reject: _reject,
		promise
	}
}
