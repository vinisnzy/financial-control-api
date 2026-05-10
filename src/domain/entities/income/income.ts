import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import { hasMoreThanTwoDecimals } from '@/utils/number-has-more-whan-two-decimals.js'

interface IncomeProps {
	id: string
	name: string
	month: string
	amount: number
	userId: string
}

export class Income {
	private props: IncomeProps

	constructor(props: IncomeProps) {
		if (!props.name) {
			throw new BadRequestError('Income name cannot be blank')
		}
		if (!props.month) {
			throw new BadRequestError('Income month cannot be blank')
		}
		if (props.amount <= 0) {
			throw new BadRequestError('Income amount cannot be negative or zero')
		}
		if (hasMoreThanTwoDecimals(props.amount)) {
			throw new BadRequestError('Expense amount cannot have more than two decimal places')
		}
		this.props = props
	}

	get name() {
		return this.props.name
	}
	get id() {
		return this.props.id
	}

	get month() {
		return this.props.month
	}

	get amount() {
		return this.props.amount
	}

	get userId() {
		return this.props.userId
	}

	set name(name: string) {
		if (!name) {
			throw new BadRequestError('Income name cannot be blank')
		}
		this.props.name = name
	}

	set amount(amount: number) {
		if (amount <= 0) {
			throw new BadRequestError('Income amount cannot be negative or zero')
		}
		this.props.amount = amount
	}
}
