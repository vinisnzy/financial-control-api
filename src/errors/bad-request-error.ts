import { CustomError } from './custom-error.js'

export class BadRequestError extends CustomError {
	constructor(message = 'Bad request error') {
		super(message, 400)
	}
}
