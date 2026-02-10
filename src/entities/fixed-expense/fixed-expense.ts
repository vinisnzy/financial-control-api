import type { ExpenseCategory } from '@/enums/expense-category.js'

interface FixedExpenseProps {
	id: string
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
}

export class FixedExpense {
	private props: FixedExpenseProps

	constructor(props: FixedExpenseProps) {
		if (!props.name) {
			throw new Error('Expense name cannot be blank')
		}
		if (!props.month) {
			throw new Error('Expense month cannot be blank')
		}
		if (props.amount <= 0) {
			throw new Error('Expense amount cannot be negative or zero')
		}
		this.props = props
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
}
