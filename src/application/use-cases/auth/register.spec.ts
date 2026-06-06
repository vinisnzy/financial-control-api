import { InMemoryUserRepository } from "@/domain/repositories/user/in-memory/in-memory-user-repository.js";
import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import { BCryptHashService } from "@/infra/services/bcrypt-hash-service.js";
import { User } from "@/domain/entities/user/user.js";
import { randomUUID } from "node:crypto";

describe('Register user use case', () => {
    it('should register an user', async () => {
        const repository = new InMemoryUserRepository()
        const hashService = new BCryptHashService()
        const registerUseCase = new RegisterUseCase(repository, hashService)

        const user = await registerUseCase.execute({
            email: 'test@gmail.com',
            password: 'testpassword',
            name: 'Test User'
        })

        expect(((await repository.findAll()).total)).toBe(1)
        expect((await repository.findById(user.id))).not.toBeNull()
        expect((await repository.findByEmail('test@gmail.com'))).not.toBeNull()
        expect((await repository.findByName('Test User'))).not.toBeNull()
    })

    it('should not create an user when exists an user with same email', async () => {
        const repository = new InMemoryUserRepository()
        const email = 'test@gmail.com'
        const hashService = new BCryptHashService()        
        const registerUseCase = new RegisterUseCase(repository, hashService)

        await registerUseCase.execute({
            email,
            password: 'testpassword',
            name: 'Test User'
        })

        await expect(registerUseCase.execute({
            email,
            password: 'testpassword',
            name: 'Test User'
        })).rejects.toThrow()
    })
})