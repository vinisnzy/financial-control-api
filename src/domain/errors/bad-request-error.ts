import { CustomError } from '@/shared/errors/custom-error.js'

export class BadRequestError extends CustomError {
	constructor(message = 'Bad request error') {
		super(message, 400)
	}
}
