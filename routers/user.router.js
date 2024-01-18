const express = require('express');
const userController = require('./../controllers/user.controller');
const router = express.Router()
const middleware = require("./../middleware/authenthicate")

router.post('/signup', userController.signup);

router.post("/login", userController.login);

router.get("/account-balance",middleware.authenticate, userController.get_user_balance);

router.get("/user/:userId" ,middleware.authenticate ,userController.find_user_byId);

router.put('/user/change-password', userController.change_password);

router.post('/create-pin',middleware.authenticate, userController.create_pin);

router.get('/all-users', userController.get_all_users)

router.get('',userController.auth);

module.exports = router;