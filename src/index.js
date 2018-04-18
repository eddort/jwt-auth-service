import 'dotenv/config'
import './db'

import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import Router from './routes'
import morgan from 'morgan'
import strategy from './strategy'

const { SERVICE_PORT } = process.env

passport.use(strategy)

const app = express()

app.use(passport.initialize())

app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(morgan('combined'))
app.use(bodyParser.json())

app.use(cookieParser())
app.use('/', Router)

app.use((err, req, res, next) => {
	if (err) {
		if (__DEV__) console.error(err);
		res.status(500).send("Omae wa shindeiru")
	}
})

app.listen(SERVICE_PORT, () => {
	if (__DEV__) {
		console.log("Express running");
	}
})

process.on('uncaughtException', err => console.log(err.stack));
process.on('UnhandledPromiseRejection', err => console.log(err.stack))