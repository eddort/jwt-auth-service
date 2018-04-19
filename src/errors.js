export class ServiceError extends Error {}
export class AuthError extends ServiceError {}
export class RegisterError extends ServiceError {}

export const handleAsyncError = (ctx) => (req, res, next) => {
	const routePromise = ctx(req, res, next);
	if (routePromise.catch) {
		routePromise.catch(err => {
			next(err)
		});
	}
}