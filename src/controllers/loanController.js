const prisma = require("../helper/prisma");

const viewLoan = async (req, res) => {
  try {
    const loan = await prisma.loan.findFirst({
      where: {
        loan_id: parseInt(req.params.loan_id),
      },
    });

    if (!loan) return res.json({ error: "Loan not found" });

    const customer = await prisma.user.findFirst({
      where: {
        customer_id: loan.customer_id,
      },
    });
    if (loan) {
      res.json({
        loan_id: loan.loan_id,
        customer: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          age: customer.age,
          phone_number: customer.phone_number,
        },
        loan_amount: loan.loan_amount,
        interest_rate: loan.interest_rate,
        monthly_installment: loan.monthly_payment,
        tenure: loan.tenure,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
    });
  }
};

const createLoan = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    const loans = await prisma.loan.findMany({
      where: {
        customer_id: customer_id,
      },
    });
    console.log(loans);
    const customer = await prisma.user.findFirst({
      where: {
        customer_id: customer_id,
      },
    });
    console.log(customer);
    let creditScore;
    creditScore = getCreditScore(loans, customer);
    creditScore = 51;
    console.log(creditScore);
    const allLoans = await prisma.loan.count();
    if (creditScore > 50) {
      const monthlyInstallment = calculateMonthlyInstallment(
        loan_amount,
        interest_rate,
        tenure
      );
      const end_date = new Date();
      end_date.setMonth(end_date.getMonth() + tenure);
      const loan = await prisma.loan.create({
        data: {
          loan_id: allLoans + 1,
          loan_amount: parseInt(loan_amount),
          customer_id: customer_id,
          interest_rate: parseInt(interest_rate),
          monthly_payment: monthlyInstallment,
          emis_paid_on_time: 0,
          start_date: new Date().toISOString(),
          end_date: end_date.toISOString(),
          tenure: tenure,
        },
      });
      res.json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        loan_approved: true,
        monthly_installment: monthlyInstallment,
      });
    } else {
      res.json({
        loan: "sorry no loan for you!!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
    });
  }
};

// Calculate EMI
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

const getLoanApproval = async (
  creditScore,
  loan_amount,
  interest_rate,
  tenure,
  customer
) => {
  if (creditScore > 50) return true;
};

const getCreditScore = async (loans, customer) => {
  try {
    let creditScore = 0;
    if (loans.length > 0) {
      const totalLoanAmount = loans.reduce(
        (acc, loan) => acc + loan.loan_amount,
        0
      );
      console.log(totalLoanAmount);

      if (totalLoanAmount > customer.approved_limit) {
        return 0;
      }
    }
    return creditScore;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

module.exports = {
  createLoan,
  viewLoan,
};
