import { execSync } from 'node:child_process'

export async function setup() {
	execSync('npx prisma migrate deploy', {
		env: { ...process.env },
		stdio: 'inherit',
	})
}
