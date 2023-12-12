const prisma = require("../helper/prisma");

const getStatement = async (req, res) => {
  try {
    const { customer_id, loan_id } = req.params;
    console.log("Params:", customer_id, loan_id);

    const loan = await prisma.loan.findFirst({
      where: {
        loan_id: parseInt(loan_id),
      },
    });

    if (loan) {
      if (loan.customer_id !== parseInt(customer_id))
        return res.json({ error: "Loan not found Customer ID does not match" });

      res.json({
        customer_id: loan.customer_id,
        loan_id: loan.loan_id,
        principal: loan.loan_amount,
        interest_rate: loan.interest_rate,
        monthly_installment: loan.monthly_payment,
        Amount_paid: loan.emis_paid_on_time * loan.monthly_payment,
        repayments_left:
          loan.loan_amount - loan.emis_paid_on_time * loan.monthly_payment > 0
            ? (loan.loan_amount -
                loan.emis_paid_on_time * loan.monthly_payment) /
              loan.monthly_payment
            : 0,
      });
    } else {
      res.json({
        error: "Loan not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({
      error: error.message,
    });
  }
};

module.exports = {
  getStatement,
};
