import { BadRequestError } from '@/domain/errors/bad-request-error.js'

interface UserRequest {
	id: string
	email: string
	password: string
	name: string
	createdAt?: Date
}

interface UserProps {
	id: string
	email: string
	password: string
	name: string
	createdAt: Date
}

export class User {
	private props: UserProps

	constructor(request: UserRequest) {
		if (!request.email) {
			throw new BadRequestError('User email cannot be blank')
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
			throw new BadRequestError('User email is invalid')
		}
		if (!request.password) {
			throw new BadRequestError('User password cannot be blank')
		}
		if (!request.name) {
			throw new BadRequestError('User name cannot be blank')
		}
		const createdAt = request.createdAt ?? new Date()
		this.props = { ...request, createdAt }
	}

	get id() {
		return this.props.id
	}

	get email() {
		return this.props.email
	}

	get password() {
		return this.props.password
	}

	get name() {
		return this.props.name
	}

	get createdAt() {
		return this.props.createdAt
	}

	set email(email: string) {
		if (!email) {
			throw new BadRequestError('User email cannot be blank')
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw new BadRequestError('User email is invalid')
		}
		this.props.email = email
	}

	set password(password: string) {
		if (!password) {
			throw new BadRequestError('User password cannot be blank')
		}
		this.props.password = password
	}

	set name(name: string) {
		if (!name) {
			throw new BadRequestError('User name cannot be blank')
		}
		this.props.name = name
	}
}
