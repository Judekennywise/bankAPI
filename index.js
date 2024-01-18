const express = require("express");
const app = express()
const userRouter = require('./routers/user.router')
const transactionRouter = require('./routers/transactions.router')


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRouter);
app.use('/api', transactionRouter)

module.exports = app