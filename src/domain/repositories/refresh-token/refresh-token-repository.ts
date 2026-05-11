import type { RefreshTokenReadRepository } from './refresh-token-read-repository.js'
import type { RefreshTokenWriteRepository } from './refresh-token-write-repository.js'

export interface RefreshTokenRepository extends RefreshTokenReadRepository, RefreshTokenWriteRepository {}
