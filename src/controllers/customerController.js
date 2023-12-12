// controllers/customerController.js

const prisma = require("../helper/prisma");
const checkEligibilityHelper = require("../helper/checkEligibilityHelper");

const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, age, phone_number, monthly_salary } =
      req.body;

    if (!first_name) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!last_name) {
      return res.status(400).json({ error: "Last name is required" });
    }
    if (!age) {
      return res.status(400).json({ error: "Age is required" });
    }
    if (!phone_number) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    if (!monthly_salary) {
      return res.status(400).json({ error: "Monthly salary is required" });
    }

    const listSize = await prisma.user.count();

    const customer = await prisma.user.create({
      data: {
        customer_id: listSize + 1,
        first_name,
        last_name,
        age: parseInt(age),
        phone_number,
        monthly_salary: parseInt(monthly_salary),
        approved_limit: 36 * parseInt(monthly_salary),
      },
    });

    res.json({
      first_name: customer.first_name,
      last_name: customer.last_name,
      age: customer.age,
      monthly_salary: customer.monthly_salary,
      approved_limit: customer.approved_limit,
      phone_number: parseInt(customer.phone_number),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const checkEligibility = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    const loans = await prisma.loan.findMany({
      where: {
        customer_id: parseInt(customer_id),
      },
    });

    const customer = await prisma.user.findFirst({
      where: {
        customer_id: parseInt(customer_id),
      },
    });

    let creditScore;
    creditScore = checkEligibilityHelper.getCreditScore(loans, customer);
    // creditScore = 51;

    const monthlyInstallment = calculateMonthlyInstallment(
      parseInt(loan_amount),
      parseInt(interest_rate),
      parseInt(tenure)
    );

    res.json({
      customer_id: parseInt(customer_id),
      loan_amount: parseInt(loan_amount),
      interest_rate: parseInt(interest_rate),
      tenure: parseInt(tenure),
      monthly_installment: monthlyInstallment,
      approval: creditScore > 50 ? "Approved" : "Rejected",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong", message: error.message });
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
  createCustomer,
  checkEligibility,
};
