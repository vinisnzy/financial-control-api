import { BadRequestError } from '@/domain/errors/bad-request-error.js'

interface RefreshTokenRequest {
	id: string
	token: string
	userId: string
	expiresAt: Date
	createdAt?: Date
}

interface RefreshTokenProps {
	id: string
	token: string
	userId: string
	expiresAt: Date
	createdAt: Date
}

export class RefreshToken {
	private props: RefreshTokenProps

	constructor(request: RefreshTokenRequest) {
		if (!request.token) {
			throw new BadRequestError('Token cannot be blank')
		}
		if (!request.userId) {
			throw new BadRequestError('User id cannot be blank')
		}
		if (!request.expiresAt) {
			throw new BadRequestError('Expiration date cannot be blank')
		}
		if (request.expiresAt < new Date()) {
			throw new BadRequestError('Expiration date cannot be earlier than the current date')
		}
		const createdAt = request.createdAt ?? new Date()
		this.props = { ...request, createdAt }
	}

	get id() {
		return this.props.id
	}

	get token() {
		return this.props.token
	}

	get userId() {
		return this.props.userId
	}

	get expiresAt() {
		return this.props.expiresAt
	}

	get createdAt() {
		return this.props.createdAt
	}
}
