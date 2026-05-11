import bcrypt from 'bcrypt'
import type { HashService } from '@/domain/services/hash-service.js'

export class BCryptHashService implements HashService {
	constructor(private readonly saltRounds = 10) {}

	async hash(plain: string): Promise<string> {
		return bcrypt.hash(plain, this.saltRounds)
	}
	async compare(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash)
	}
}
