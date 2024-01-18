const User = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require('bcrypt');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  };

exports.get_all_users = async (req, res) => {
    try{
    const user = await User.find({});
        res.json(user);
    }catch(err){
     throw(err)
    }
};

exports.signup = async (req, res, next) => {
    try {
      const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        accountType: req.body.accountType,
      });
      
      //assign token to user
    const token = signToken(newUser._id);

    //hide password before returning user's details
    newUser.password = undefined;
    newUser.token = token

    //send back response
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    if (err) return next(err);
  }
};


exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      //check if user provided email and password
      if (!email || !password) {
        res.status(401).json("Please provide email and password");
        return next(new Error("Please provide email and password"));
      }
      //check if user exist in the database and compare passwords
      const user = await User.findOne({ email });
      console.log(user)
      if (!user && !(await user.isValidPassword(password, user.password))) {
        res.status(400).json("Incorrect email, account number or password");
        return next(new Error("Incorrect email, account number or password"));
      }
       //assign toke to user
      const token = signToken(user._id);
  
      res.status(200).json({
        status: "success",
        token,
      });
    } catch (err) {
      throw err;
    }
};


exports.change_password = async function(req, res) {
    try {
        const { email, password, newPassword, newPassConfirm } = req.body;
        if (!(email && password && newPassword && newPassConfirm)) {
            res.status(400).json("All input are required");
        }
        const user = await User.findOne({ email });
        if (user === null || (bcrypt.compare(password, user.password) === false)) {
            res.status(400).json("Invalid Credentials");
        }
        if (newPassword !== newPassConfirm) {
            res.status(400).json("New password and Password confirmation must match");
        }
        if (user && bcrypt.compare(password, user.password) && newPassword === newPassConfirm) {
            let encryptedPassword = await bcrypt.hash(newPassConfirm, 10);
            user.password = encryptedPassword;
            user.save();
            res.status(200).json("Password Changed Successfully");
        }
    } catch (e) {
        return res.json({ message: e });
    }
};

exports.find_user_byId = function(req, res) {
    try{
    const user = User.findById(req.params.Id);
        if (!user){
            res.status(404).json("User Does not exist in the database");
        
    };
    
    res.json(user);
    }catch(err){
        throw err
    }
};

exports.get_user_balance = function(req, res) {
    try{
    const user= User.findById(req.params.Id);
    if (!user) {
        return res.status(404).json({
          status: "Failed",
          message: "User with given Id not found",
        });
      }
    res.json(`The account balance of ${user.fullName} is ${user.accountBalance}`);
    
    }catch(err){
        throw err
      }
}

exports.create_pin = async (req, res) => {
    try{
    let transactionPin = req.body.transactionPin
    let user = await User.findById(req.user._id);
    user.transactionPin = transactionPin
    user.save()
    res.status(201).json('Pin created succesfully');
    }catch(err){
        throw(err);
    }
}

//testing authorization
exports.auth = function(req, res) {
    res.status(200).json("Welcome to This Bank Api built with NodeJs");
}