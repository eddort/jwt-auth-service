import mongoose from 'mongoose'
import { log, error } from 'console'

const {
	MONGODB_USER,
	MONGO_PORT,
	MONGODB_PASS,
	MONGO_HOST,
	MONGODB_DATABASE,
	MONGO_USE_RECONNECT = true,
	MONGO_MAX_CONNECTIONS = 5,
	MONGO_USE_AUTO_INDEX = false,
	MONGO_USE_DEBUG = true
} = process.env

const options = {
	user: MONGODB_USER,
	pass: MONGODB_PASS,
	auth: {
		authdb: 'admin'
	},
	autoReconnect: MONGO_USE_RECONNECT,
	poolSize: MONGO_MAX_CONNECTIONS,
	autoIndex: MONGO_USE_AUTO_INDEX
};

mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGODB_DATABASE}`, options)

mongoose.set('debug', MONGO_USE_DEBUG);

mongoose.connection.on('connected', () => log('[MongoDB] is connected on port', MONGO_PORT))
mongoose.connection.on('disconnected', () => error('[MongoDB] is disconnected'))