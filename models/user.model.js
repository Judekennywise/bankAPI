const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    firstname: 
    { 
        type: String, 
        required: [true, "Please enter your Firstname" ]
    },
    lastname: {
        type: String,
        required: [true, "Please enter your Lastname"]
    },
    email: 
    { 
        type: String, 
        required: "Email address is required", 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
        unique: [true, "A user email must be unique"],
        lowercase: true,
        validate: [validator.isEmail, "Please, enter a valid email"]
    },
    password: 
    { 
        type: String, 
        required: "Password is required" },
    token: {
        type: String },
    accountNumber: { 
        type: Number, 
        default: Math.floor(Math.random() * 10000000) + 1111111111,
        unique: [true, "Aunique account number"],
    },
    accountBalance: { 
        type: Number, 
        default: 0,
    },
    accountType: { 
        type: String, 
        enum: ['savings', 'current'], 
        default: 'savings' },
    transactionPin: {
        type: String,
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
});

//add a pre-hook function to the UserSchema. This function gets called before the user info is stored in the database
UserSchema.pre("save", async function (next) {
    //hash incoming password before saving to db
    this.password = await bcrypt.hash(this.password, 12);
    if (this.transactionPin){
        this.transactionPin = await bcrypt.hash(this.transactionPin, 12);
    };
    next()
   });
   //This method will chain a function that compares and validates the password.
UserSchema.methods.isValidPassword = async function (
     currentPassword,
     storedUserPassword) 
     {
     return await bcrypt.compare(currentPassword, storedUserPassword);
   };
   

module.exports = mongoose.model("User", UserSchema);