var MongoClient = require('mongodb').MongoClient;

const {
  MONGO_USER,
  MONGO_PASS
} = process.env

const options = {
useNewUrlParser: true,
reconnectTries: Number.MAX_VALUE,
reconnectInterval: 500,
connectTimeoutMS: 10000,
auto_reconnect: true
}

stringUrl = `mongodb://${MONGO_USER}:${MONGO_PASS}@mongo:27017/tester?authSource=admin`
module.exports = function () {
  opts = options
  uri = stringUrl
	var property = opts.property || 'db'
	delete opts.property

	var connection

	return function expressMongoDb(req, res, next) {
		if (!connection) {
			connection = MongoClient.connect(uri, opts)
		}

		connection
			.then(function (db) {
				req[property] = db
				next()
			})
			.catch(function (err) {
				connection = undefined
				next(err)
			})
	}
}