export function hasMoreThanTwoDecimals(value: number): boolean {
	const [, decimals] = value.toString().split('.')
	return decimals !== undefined && decimals.length > 2
}