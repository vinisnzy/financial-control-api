import type { UserReadRepository } from './user-read-repository.js'
import type { UserWriteRepository } from './user-write-repository.js'

export interface UserRepository extends UserWriteRepository, UserReadRepository {}
