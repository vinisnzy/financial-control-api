import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByCategoryAndMonthUseCase } from './find-variable-expenses-by-category-and-month.js'

describe('Find variable expenses by category and month use case', () => {
  it('should find variable expenses by category and month', async () => {
    const repository = new InMemoryVariableExpenseRepository()
    const createVariableExpense = new CreateVariableExpenseUseCase(repository)
    const findByCategoryAndMonth = new FindVariableExpensesByCategoryAndMonthUseCase(repository)

    await createVariableExpense.execute({
      name: 'Supermarket',
      month: '2026-02',
      amount: 300,
      category: ExpenseCategory.FOOD,
      necessary: true,
      date: '2026-02-10',
    })
    await createVariableExpense.execute({
      name: 'Cinema',
      month: '2026-02',
      amount: 50,
      category: ExpenseCategory.LEISURE,
      necessary: false,
      date: '2026-02-11',
    })
    await createVariableExpense.execute({
      name: 'Supermarket January',
      month: '2026-01',
      amount: 250,
      category: ExpenseCategory.FOOD,
      necessary: true,
      date: '2026-01-10',
    })

    const foodFeb = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-02')
    expect(foodFeb).toHaveLength(1)
    expect(foodFeb[0].name).toBe('Supermarket')

    const leisureFeb = await findByCategoryAndMonth.execute(ExpenseCategory.LEISURE, '2026-02')
    expect(leisureFeb).toHaveLength(1)
    expect(leisureFeb[0].name).toBe('Cinema')

    const foodJan = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-01')
    expect(foodJan).toHaveLength(1)
    expect(foodJan[0].name).toBe('Supermarket January')

    const none = await findByCategoryAndMonth.execute(ExpenseCategory.INVESTMENT, '2026-02')
    expect(none).toHaveLength(0)
  })
})
