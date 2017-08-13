const shortid = require('shortid')
const {deferred} = require('../utils')

module.exports = {
	Mutation: {
		createEvent: (obj, params, ctx) => {
			const {resolve, reject, promise} = deferred()
			const id = shortid.generate()
			const key = 'events!' + Date.now().toString() + '~' + id

			const event = {
				id,
				title: params.title,
				description: params.description,
				tags: params.tags,
				start: params.start,
				end: params.end
			}

			ctx.db.put(key, JSON.stringify(event), err => {
				if (err) {
					return reject(err)
				}
				return resolve(event)
			})

			return promise
		}
	}
}
