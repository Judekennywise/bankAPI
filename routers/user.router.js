const express = require('express');
const userController = require('./../controllers/user.controller');
const router = express.Router()
const middleware = require("./../middleware/authenthicate")

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: User signup
 *     description: Register a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: First name of the user.
 *               lastname:
 *                 type: string
 *                 description: Last name of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *               accountType:
 *                 type: string
 *                 description: Type of user account (e.g., savings, current).
 *     responses:
 *       201:
 *         description: User successfully created.
 *         
 *       400:
 *         description: Email already exists. Please use a different email.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Email already exists. Please use a different email.
 */
router.post('/signup', userController.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: User login
 *     description: Log in an existing user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               token: [user_token]
 *       401:
 *         description: Please provide email and password.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Please provide email and password.
 *       400:
 *         description: Incorrect email, account number, or password.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Incorrect email, account number, or password.
 */
router.post("/login", userController.login);
/**
 * @swagger
 * /account-balance:
 *   get:
 *     tags:
 *     - User Controller
 *     summary: Get user account balance
 *     description: Retrieve the account balance of the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data: The account balance of [user_fullName] is [user_accountBalance]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 *       404:
 *         description: User with the given Id not found.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: User with given Id not found.
 */

router.get("/account-balance",middleware.authenticate, userController.get_user_balance);
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags:
 *     - User Controller
 *     summary: Get user by ID
 *     description: Retrieve user details by their ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data: [user_details]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 *       404:
 *         description: User with the given ID not found.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: User with given ID not found.
 */
router.get("/user/:userId" ,middleware.authenticate ,userController.find_user_byId);
/**
 * @swagger
 * /user/change-password:
 *   put:
 *     tags:
 *     - User Controller
 *     summary: Change user password
 *     description: Change the password for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password of the user.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password for the user.
 *               newPassConfirm:
 *                 type: string
 *                 format: password
 *                 description: Confirm the new password.
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Password changed successfully.
 *       400:
 *         description: Invalid credentials or new password and confirmation do not match.
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
router.put('/user/change-password', userController.change_password);
/**
 * @swagger
 * /create-pin:
 *   post:
 *     tags:
 *     - User Controller
 *     summary: Create user transaction PIN
 *     description: Set the transaction PIN for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionPin:
 *                 type: string
 *                 description: New transaction PIN for the user.
 *     responses:
 *       201:
 *         description: Transaction PIN created successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Pin created successfully.
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 */

router.post('/create-pin',middleware.authenticate, userController.create_pin);
/**
 * @swagger
 * /all-users:
 *   get:
 *     tags:
 *     - User Controller
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data: [user_list]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Unauthorized. User not authenticated.
 */
router.get('/all-users', userController.get_all_users)

router.get('',userController.auth);

module.exports = router;