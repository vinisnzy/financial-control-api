/*
  Warnings:

  - Added the required column `user_id` to the `fixed_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `incomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `variable_expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fixed_expenses" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "incomes" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "variable_expenses" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "fixed_expenses_user_id_idx" ON "fixed_expenses"("user_id");

-- CreateIndex
CREATE INDEX "incomes_user_id_idx" ON "incomes"("user_id");

-- CreateIndex
CREATE INDEX "variable_expenses_user_id_idx" ON "variable_expenses"("user_id");

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_expenses" ADD CONSTRAINT "fixed_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variable_expenses" ADD CONSTRAINT "variable_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
