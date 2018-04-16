import 'dotenv/config'
import './db'

import express from 'express'
import bodyParser from 'body-parser'

import passport from 'passport'
import passportJWT from 'passport-jwt'
import User from './model/user'
import Router from './routes'

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

app.listen(8082, () => {
	if (__DEV__) {
		console.log("Express running");
	}
})