-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_customer_id_fkey";

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;
