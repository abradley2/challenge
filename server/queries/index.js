const jwt = require('jsonwebtoken')
const {privateKey} = require('../../local')
const {deferred} = require('../utils')

module.exports = {
	Query: {
		events(obj, args, ctx) {
			const {resolve, reject, promise} = deferred()
			const db = ctx.db
			const todos = []

			db.createReadStream({
				gt: 'events!',
				lt: 'events~'
			})
				.on('data', data => {
					todos.push(JSON.parse(data.value))
				})
				.on('error', err => {
					reject(err)
				})
				.on('end', () => {
					resolve(todos)
				})

			return promise
		},
		token(obj, args) {
			const {resolve, reject, promise} = deferred()
			const {username} = args

			jwt.sign({username}, privateKey, {expiresIn: '1d'}, (err, token) => {
				if (err) {
					return reject(err)
				}
				return resolve(token)
			})

			return promise
		}
	},
	Event: {
		participants() {
			return Promise.resolve(['subtask one', 'subtasktwo'])
		}
	}
}
