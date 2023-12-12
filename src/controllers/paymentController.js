const prisma = require("../helper/prisma");

const makePayment = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;

    const loan = await prisma.loan.findFirst({
      where: {
        loan_id: parseInt(loan_id),
      },
    });

    const customer = await prisma.user.findFirst({
      where: {
        customer_id: parseInt(customer_id),
      },
    });
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    if (!customer) return res.json({ error: "Customer not found" });

    if (loan.customer_id != customer_id)
      return res.json({ error: "Customer ID does not match" });

    const remainingAmount =
      loan.loan_amount - loan.emis_paid_on_time * loan.monthly_payment;

    if (remainingAmount <= 0) return res.json({ error: "Loan already paid" });

    if (remainingAmount > 0) {
      const principalAmt =
        loan.monthly_payment -
        (remainingAmount > loan.monthly_payment
          ? 0
          : loan.monthly_payment - remainingAmount);
      const monthly_payment = calculateMonthlyInstallment(
        principalAmt,
        loan.interest_rate,
        loan.tenure
      );
      await prisma.loan.update({
        where: {
          loan_id: loan.loan_id,
        },
        data: {
          emis_paid_on_time: loan.emis_paid_on_time + 1,
          monthly_payment: monthly_payment,
        },
      });

      res.json({
        message: "Payment successful",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

function calculateMonthlyInstallment(
  principal,
  annualInterestRate,
  tenureInMonths
) {
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  const numberOfPayments = tenureInMonths;

  const emi =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return emi;
}

module.exports = {
  makePayment,
};
