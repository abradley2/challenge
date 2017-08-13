exports.setupSession = function (req, res, ctx, next) {
	next()
}

exports.readBody = function (req, res, ctx, next) {
	const body = []
	let size = 0

	req
		.on('data', chunk => {
			body.push(chunk)
			size = chunk.length + size
			ctx.log.debug(size)
		})
		.on('end', () => {
			try {
				req.body = JSON.parse(Buffer.concat(body).toString())
			} catch (err) {
				return next(err)
			}
			return next()
		})
}
