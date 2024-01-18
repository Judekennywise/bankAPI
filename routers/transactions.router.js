const express = require('express');
const transactionController = require('./../controllers/transaction.controller');
const router = express.Router()
const middleware = require("./../middleware/authenthicate")

router.post('/deposit-funds', middleware.authenticate, transactionController.deposit_funds);

router.post("/transfer", middleware.authenticate ,transactionController.transfer_money);

router.get("/transactions", transactionController.get_all_transactions);

//router.get("/account-balance",middleware.authenticate, userController.get_user_balance);

//router.get("/user/:userId" ,middleware.authenticate ,userController.find_user_byId);

module.exports = router;