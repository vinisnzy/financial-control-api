import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByCategoryUseCase } from './find-variable-expense-by-category.js'

describe('Find variable expenses by category use case', () => {
  it('should find variable expenses by category', async () => {
    const repository = new InMemoryVariableExpenseRepository()
    const createVariableExpense = new CreateVariableExpenseUseCase(repository)
    const findByCategory = new FindVariableExpensesByCategoryUseCase(repository)

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
      month: '2026-03',
      amount: 50,
      category: ExpenseCategory.LEISURE,
      necessary: false,
      date: '2026-03-11',
    })

    const food = await findByCategory.execute(ExpenseCategory.FOOD)
    expect(food).toHaveLength(1)
    expect(food[0].name).toBe('Supermarket')

    const leisure = await findByCategory.execute(ExpenseCategory.LEISURE)
    expect(leisure).toHaveLength(1)
    expect(leisure[0].name).toBe('Cinema')
  })
})
