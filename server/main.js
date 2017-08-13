const http = require('http')
const fs = require('fs')
const path = require('path')
// Do you like pino coladaaaaas? Getting caught in the rain??
const log = require('pino')()
const series = require('run-series')
const corsify = require('corsify')
const app = require('merry')()
const level = require('level')
const WebSocket = require('ws')
const nodeStatic = require('node-static')
const {graphql} = require('graphql')
const {makeExecutableSchema} = require('graphql-tools')
const middleware = require('./middleware')

const fileServer = new nodeStatic.Server(path.join(__dirname, '../public'))

const schema = makeExecutableSchema({
	typeDefs: fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8'),
	resolvers: Object.assign(
		require('./queries'),
		require('./mutations')
	)
})

app.route('POST', '/graphql', applyMiddleware((req, res, ctx) => {
	graphql(schema, req.body.request, '', ctx)
		.then(response => ctx.send(200, response))
		.catch(err => {
			ctx.log.error({name: 'graphql error'}, err)
			ctx.send(500, err)
		})
}))

app.route('default', (req, res, ctx) => {
	fileServer.serve(req, res, e => {
		if (e) {
			ctx.send(404, 'Cruisin down the streets in my 404')
		}
	})
})

// Initialize server
const handler = app.start()
const corsOpts = {
	'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
const server = http.createServer(corsify(corsOpts, (req, res) => handler(req, res)))

// Add WebSocket Server and DB handler to locals
const db = level('./db')
const wss = new WebSocket.Server({server})

// Start server and listen on port
server.listen(process.env.PORT, () => {
	log.info({name: 'server/start'}, `Server listening on port ${process.env.PORT}`)
})

// Apply middleware
function applyMiddleware(handlerFunc) {
	return (req, res, ctx) => series(
		[
			next => next(null, Object.assign(ctx, {db, wss})),
			next => middleware.readBody(req, res, ctx, next),
			next => middleware.setupSession(req, res, ctx, next)
		],
		err => {
			if (err) {
				ctx.log.error({name: 'middleware error'}, err)
				ctx.send(500, err)
				return
			}
			handlerFunc(req, res, ctx)
		}
	)
}
