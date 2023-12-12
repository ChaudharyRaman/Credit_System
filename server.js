const express = require("express");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
dotenv.config();

const prisma = require("./src/helper/prisma");
const userRouter = require('./src/routes/user.router')
const loanRouter = require('./src/routes/loan.router')
const statementRouter = require('./src/routes/statement.router')
const paymentRouter = require('./src/routes/payment.router')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("API workingg !");
});

app.use('',userRouter);
app.use('/create-loan',loanRouter)
app.use('/view-loan',loanRouter)
app.use('/make-payment',paymentRouter)
app.use('/view-statement',statementRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
