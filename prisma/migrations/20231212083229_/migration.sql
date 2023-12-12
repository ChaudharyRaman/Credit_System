-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "loan_id" INTEGER NOT NULL,
    "loan_amount" INTEGER NOT NULL,
    "tenure" INTEGER NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "monthly_payment" INTEGER NOT NULL,
    "emis_paid_on_time" INTEGER NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Loan_loan_id_key" ON "Loan"("loan_id");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
