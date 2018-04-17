import 'dotenv/config'
import './db'

import express from 'express'
import bodyParser from 'body-parser'

import passport from 'passport'
import passportJWT from 'passport-jwt'
import User from './model/user'
import Router from './routes'

const { SERVICE_PORT } = process.env

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const strategy = new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
	secretOrKey: 'secret'
}, async ({ id }, next) => {
	const user = await User.findOne({ _id: id })
	if (user) {
		next(null, user)
	} else {
		next(null, false)
	}
});

passport.use(strategy)

const app = express()

app.use(passport.initialize())

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(bodyParser.json())

app.use('/', Router)

app.use((err, req, res, next) => {
	if (err) {
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