import { CustomError } from '@/shared/errors/custom-error.js'

export class UnauthorizedError extends CustomError {
	constructor(message = 'Unauthorized error') {
		super(message, 401)
	}
}
