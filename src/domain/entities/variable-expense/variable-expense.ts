import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import { hasMoreThanTwoDecimals } from '@/utils/number-has-more-whan-two-decimals.js'

interface VariableExpenseRequest {
	id: string
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
	userId: string
	date?: Date
}

interface VariableExpenseProps {
	id: string
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
	userId: string
	date: Date
}

export class VariableExpense {
	private props: VariableExpenseProps

	constructor(request: VariableExpenseRequest) {
		if (!request.month) {
			throw new BadRequestError('Expense month cannot be blank')
		}
		if (!request.name) {
			throw new BadRequestError('Expense name cannot be blank')
		}
		if (request.amount <= 0) {
			throw new BadRequestError('Expense amount cannot be negative or zero')
		}
		if (hasMoreThanTwoDecimals(request.amount)) {
			throw new BadRequestError('Expense amount cannot have more than two decimal places')
		}
		const date = request.date ?? new Date()
		this.props = {
			...request,
			date,
		}
	}

	get id() {
		return this.props.id
	}

	get month() {
		return this.props.month
	}

	get name() {
		return this.props.name
	}

	get amount() {
		return this.props.amount
	}

	get category() {
		return this.props.category
	}

	get necessary() {
		return this.props.necessary
	}

	get date() {
		return this.props.date
	}

	get userId() {
		return this.props.userId
	}
}
