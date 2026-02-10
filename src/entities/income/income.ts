interface IncomeProps {
	id: string
	name: string
	month: string
	amount: number
}

export class Income {
	private props: IncomeProps

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

	set name(name: string) {
		if (!name) {
			throw new Error('Income name cannot be blank')
		}
		this.props.name = name
	}

	set amount(amount: number) {
		if (amount <= 0) {
			throw new Error('Income amount cannot be negative or zero')
		}
		this.props.amount = amount
	}

	constructor(props: IncomeProps) {
		if (!props.name) {
			throw new Error('Income name cannot be blank')
		}
		if (!props.month) {
			throw new Error('Income month cannot be blank')
		}
		if (props.amount <= 0) {
			throw new Error('Income amount cannot be negative or zero')
		}
		this.props = props
	}
}
