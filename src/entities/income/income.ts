interface IncomeProps {
	id: string
	month: string
	amount: number
}

export class Income {
	private props: IncomeProps

	get id() {
		return this.props.id
	}

	get month() {
		return this.props.month
	}

	get amount() {
		return this.props.amount
	}

	constructor(props: IncomeProps) {
		if (!props.month) {
			throw new Error('Income month cannot be blank')
		}
		if (props.amount <= 0) {
			throw new Error('Income amount cannot be negative or zero')
		}
		this.props = props
	}
}
