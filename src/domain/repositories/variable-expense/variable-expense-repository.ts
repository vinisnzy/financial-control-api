import type { VariableExpenseReadRepository } from './variable-expense-read-repository.js'
import type { VariableExpenseWriteRepository } from './variable-expense-write-repository.js'

export interface VariableExpenseRepository extends VariableExpenseReadRepository, VariableExpenseWriteRepository {}
