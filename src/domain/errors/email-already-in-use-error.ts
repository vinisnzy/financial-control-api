import { CustomError } from '@/shared/errors/custom-error.js'

export class EmailAlreadyInUseError extends CustomError {
	constructor(message = 'Email already in use error') {
		super(message, 400)
	}
}
