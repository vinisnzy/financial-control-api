import { CustomError } from '@/shared/errors/custom-error.js'

export class InvalidCredentialsError extends CustomError {
		constructor(message = 'Invalid credentials error') {
			super(message, 400)
		}
	}
