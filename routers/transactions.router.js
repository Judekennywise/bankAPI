const express = require('express');
const transactionController = require('./../controllers/transaction.controller');
const router = express.Router()
const middleware = require("./../middleware/authenthicate")


/**
 * @swagger
 * /deposit-funds:
 *   post:
 *     tags:
 *     - Transaction Controller
 *     summary: Deposit funds
 *     description: Deposit funds into a user's account.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Account number of the user.
 *               depositAmount:
 *                 type: number
 *                 description: Amount to deposit.
 *               from:
 *                 type: string
 *                 description: Source of the deposit.
 *     responses:
 *       201:
 *         description: Deposit successful.
 *         content:
 *           application/json:
 *             example:
 *               status: successful
 *               Account name: [user_accountName]
 *               Deposit Amount: [formatted_depositAmount]
 *               Reference Number: [referenceNumber]
 *               Account balance: [formatted_accountBalance]
 *       400:
 *         description: Invalid input or user not found.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: [error_message]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 */

/**
 * @swagger
 * /transfer-money:
 *   post:
 *     tags:
 *     - Transaction Controller
 *     summary: Transfer money
 *     description: Transfer money from the authenticated user's account to another user's account.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Account number of the beneficiary user.
 *               transferAmount:
 *                 type: number
 *                 description: Amount to transfer.
 *               remark:
 *                 type: string
 *                 description: Remark or reason for the transfer.
 *               transactionPin:
 *                 type: string
 *                 format: password
 *                 description: Transaction PIN for the authenticated user.
 *     responses:
 *       201:
 *         description: Transfer successful.
 *         content:
 *           application/json:
 *             example:
 *               status: successful
 *               Account name: [beneficiary_accountName]
 *               Transfer Amount: [formatted_transferAmount]
 *               Reference Number: [referenceNumber]
 *       400:
 *         description: Invalid input, insufficient funds, or user not found.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: [error_message]
 *       401:
 *         description: Unauthorized. User not authenticated or incorrect transaction PIN.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated or incorrect transaction PIN.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /get-all-transactions:
 *   get:
 *     tags:
*      - Transaction Controller
 *     summary: Get all transactions
 *     description: Retrieve a list of all transactions in the system.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data: [transaction_list]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.post('/deposit-funds', middleware.authenticate, transactionController.deposit_funds);

router.post("/transfer", middleware.authenticate ,transactionController.transfer_money);

router.get("/transactions", transactionController.get_all_transactions);

//router.get("/account-balance",middleware.authenticate, userController.get_user_balance);

//router.get("/user/:userId" ,middleware.authenticate ,userController.find_user_byId);

module.exports = router;