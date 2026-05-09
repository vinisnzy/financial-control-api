import type { IncomeReadRepository } from './income-read-repository.js'
import type { IncomeWriteRepository } from './income-write-repository.js'

export interface IncomeRepository extends IncomeReadRepository, IncomeWriteRepository {}
