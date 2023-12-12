// seed.js
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");

const prisma = new PrismaClient();

const csvFilePath = "./loan_data.csv";

function loanseed() {
  try {
    prisma.loan.deleteMany();

    const processedLoanIds = new Set();
    const loanData = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        const loanId = parseInt(row.loan_id);

        // Skip processing if the loan_id has already been processed
        if (processedLoanIds.has(loanId)) {
          console.log(`Skipping duplicate loan_id: ${loanId}`);
          return;
        }

        // Add the loan_id to the set of processed loan_ids
        processedLoanIds.add(loanId);

        loanData.push({
          loan_id: loanId,
          loan_amount: parseInt(row.loan_amount),
          tenure: parseInt(row.tenure),
          interest_rate: parseFloat(row.interest_rate),
          monthly_payment: parseInt(row.monthly_payment),
          emis_paid_on_time: parseInt(row["EMIs paid on Time"]),
          start_date: row.start_date,
          end_date: row.end_date,
          customer_id: parseInt(row.customer_id),
        });
      })
      .on("end", async () => {
        for (const loan of loanData) {
          await prisma.loan.create({
            data: loan,
          });
        }

        console.log("Data seeded successfully.");

        // Close Prisma client connection
        await prisma.$disconnect();
      });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

loanseed();
