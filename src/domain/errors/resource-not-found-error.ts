import { CustomError } from '@/shared/errors/custom-error.js'

export class ResourceNotFoundError extends CustomError {
	constructor(message = 'Resource not found') {
		super(message, 404)
	}
}
