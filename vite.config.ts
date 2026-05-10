import { createRequire } from 'node:module'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)

function loadEnvFile(path: string) {
	const dotenv = require('dotenv')
	return dotenv.config({ path }).parsed ?? {}
}

export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		projects: [
			{
				resolve: { tsconfigPaths: true },
				test: {
					name: 'unit',
					include: ['src/**/*.spec.ts'],
					exclude: ['src/**/*.integration.spec.ts', 'src/**/controllers/**/*.spec.ts'],
					pool: 'forks',
					fileParallelism: false,
				},
			},
			{
				resolve: { tsconfigPaths: true },
				test: {
					name: 'http',
					include: ['src/**/controllers/**/*.spec.ts'],
					pool: 'forks',
					fileParallelism: false,
				},
			},
			{
				resolve: { tsconfigPaths: true },
				test: {
					name: 'integration',
					include: ['src/**/*.integration.spec.ts'],
					env: loadEnvFile('.env.test'),
					globalSetup: ['./test/global-setup.ts'],
					setupFiles: ['./test/setup.ts'],
					pool: 'forks',
					fileParallelism: false,
				},
			},
		],
	},
})
