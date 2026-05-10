import { BadRequestError } from '@/domain/errors/bad-request-error.js'

interface UserProps {
	id: string
	email: string
	password: string
	name: string
	createdAt: Date
}

export class User {
	private props: UserProps

	constructor(props: UserProps) {
		if (!props.email) {
			throw new BadRequestError('User email cannot be blank')
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
			throw new BadRequestError('User email is invalid')
		}
		if (!props.password) {
			throw new BadRequestError('User password cannot be blank')
		}
		if (!props.name) {
			throw new BadRequestError('User name cannot be blank')
		}
		this.props = props
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
