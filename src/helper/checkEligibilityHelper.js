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
  getCreditScore,
};
