import express from 'express'
import Joi from 'joi'
import User, { authSchema } from './model/user'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { handleAsyncError as ae } from './errors'

const root = express.Router()
const $ = express.Router()

const {
	SUCESS_REDIRECT_URL = 'http://google.com',
	FAIL_REDIRECT_URL = 'http://ya.ru',
	JWT_TOKEN_EXPIRES_IN = '1h'
} = process.env
//external auth route for client-side
//making redirect without query
$.get('/register', (req, res) => res.redirect(`${SUCESS_REDIRECT_URL}/auth/register`))
$.get('/login', (req, res) => res.redirect(`${SUCESS_REDIRECT_URL}/auth/login`))

$.post('/register', ae(async (req, res) => {
	if (Joi.validate(req.body, authSchema).error) {
		return res.status(401).json({ error: "Register error" })
	}
	const user = await User.getNew(req.body)
	res.json(user)
}))

$.post('/login', async (req, res) => {
	if (Joi.validate(req.body, authSchema).error) {
		return res.status(401).json({ error: "Auth error" })
	}
	const authUser = await User.findUserAndCheckPswd(req.body)
	const token = jwt.sign({ id: authUser._id }, 'secret', { expiresIn: JWT_TOKEN_EXPIRES_IN })

	res.json({message: "ok", token})
})

root.use('/auth', $)

root.use('*', async (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (user) {
			res.set({
				'userFrom': user._id
			})
			res.redirect(`${SUCESS_REDIRECT_URL}/${req.url}`)
		} else {
			res.redirect(FAIL_REDIRECT_URL)
		}
	})(req, res);
})

export default root