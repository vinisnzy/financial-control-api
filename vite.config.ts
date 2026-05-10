import { createRequire } from 'node:module'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)

function loadEnvFile(path: string) {
	const dotenv = require('dotenv')
	return dotenv.config({ path }).parsed ?? {}
}

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		projects: [
			{
				plugins: [tsconfigPaths()],
				test: {
					name: 'unit',
					include: ['src/**/*.spec.ts'],
					exclude: ['src/**/*.integration.spec.ts'],
					pool: 'forks',
					fileParallelism: false,
				},
			},
			{
				plugins: [tsconfigPaths()],
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
