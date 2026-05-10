import type { FixedExpenseReadRepository } from './fixed-expense-read-repository.js'
import type { FixedExpenseWriteRepository } from './fixed-expense-write-repository.js'

export interface FixedExpenseRepository extends FixedExpenseReadRepository, FixedExpenseWriteRepository {}
