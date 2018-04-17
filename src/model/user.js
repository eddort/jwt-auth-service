import crypto from 'crypto'
import { model } from 'mongoose-decorators'
import Joi from 'joi'
import { AuthError, RegisterError } from '../errors'

export const usernameShema =
	Joi.string()
		.min(3)
		.max(24)
		.alphanum()
		.required()

export const passwordShema =
	Joi.string()
		.min(8)
		.max(64)
		.required()

export const authSchema = Joi.object().keys({
	username: usernameShema,
	password: passwordShema
})

const { 
	MONGO_USE_AUTO_INDEX = false
 } = process.env

@model({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: String,
	dateCreate: {
		type: Date,
		default: Date.now
	}
}, {
	autoIndex: MONGO_USE_AUTO_INDEX
})
export default class User {
	get password() {
		return this.hashedPassword
	}
	set password(password) {
		if (! Joi.validate(password, passwordShema).error) {
			if (__DEV__) {
				console.error(Joi.validate(password, passwordShema).error)
			}
			return new RegisterError('Password not valid')
		}
		this.salt = crypto.randomBytes(128).toString('base64')
		this.hashedPassword = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString('hex')
	}
	checkPassword({ password }) {
		return this.password === crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString('hex')
	}
	static async findUserAndCheckPswd(authInfo) {
		if (this.validateAuthInfo(authInfo)) {
			return new AuthError('authInfo error')
		}
		
		const user = await this.findForAuth(authInfo)
		
		if (! user || ! user.checkPassword(authInfo)) {
			throw new AuthError('Password not valid')
		}
		return user
	}
	static validateAuthInfo(authInfo) {
		return Joi.validate(authInfo, authSchema).error
	}
	static async findForAuth({ username }) {
		return this.findOne({ username })
	}
	static checkUserExist(username) {
		return this.findOne({ username }, { _id: 1 }).lean().exec()
	}
	static async getNew({ username, password }) {
		let User = this;
		const userIsExist = await User.checkUserExist(username)
		if (userIsExist) {
			return new RegisterError('User is exist')
		}
		const user = new User({ username, password })
		return user.save()
	}
}