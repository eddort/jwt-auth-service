import express from 'express'
import Joi from 'joi'
import User, { authSchema } from './model/user'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const root = express.Router()
const $ = express.Router()

const {
	SUCESS_REDIRECT_URL = 'http://google.com',
	FAIL_REDIRECT_URL = 'http://ya.ru'
	} = process.env

$.post('/register', async (req, res) => {
	if (Joi.validate(req.body, authSchema).error) {
		return res.status(401).json({ error: "Register error" })
	}
	const user = await User.getNew(req.body)
	res.json(user)
})

$.post('/login', async (req, res) => {
	if (Joi.validate(req.body, authSchema).error) {
		return res.status(401).json({ error: "Auth error" })
	}
	const authUser = await User.findUserAndCheckPswd(req.body)
	const token = jwt.sign({ id: authUser._id }, 'secret', { expiresIn: '1m' })
	res.json({message: "ok", token})
})

root.use('/auth', $)

root.use('*', async (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (user) {
			res.redirect(SUCESS_REDIRECT_URL)
		} else {
			res.redirect(FAIL_REDIRECT_URL)
		}
	})(req, res);
})

export default root