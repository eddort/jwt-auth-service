import User from './model/user'
import passportJWT from 'passport-jwt'

const JwtStrategy = passportJWT.Strategy

export default new JwtStrategy({
	jwtFromRequest: (req) => {
		let token
		if (! req) return token;
		if (req.cookies && req.cookies['JWT']) token = req.cookies['JWT'];
		if (req.headers && req.headers['authorization']) token = req.headers['authorization'];
		return token
	},
	secretOrKey: 'secret'
}, async ({ id }, next) => {
	try {
		const user = await User.findOne({ _id: id }, { _id: 1 })
		if (user) {
			next(null, user)
		} else {
			next(null, false)
		}
	} catch (e) {
		next(e)
	}
});