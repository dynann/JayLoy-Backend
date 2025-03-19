-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_currencyID_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userID_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountID_fkey";

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_currencyID_fkey" FOREIGN KEY ("currencyID") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
