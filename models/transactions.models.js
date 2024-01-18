const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transactionType: { 
        type: String, 
        enum: ['Deposit', 'Withdraw', 'Transfer'] 
    },
    accountNumber: { 
        type: Number, 
        required: "please ensure that the account number exists" 
    },
    sender: { 
        type: String 
    },
    remark: { 
        type: String
    },
    transactionAmount: { 
        type: Number, 
        required: "please enter a transaction amount" 
    },
    transactionTime: { 
        type: Date, 
        default: Date.now 
    },
    referenceNumber:{
        type: Number,
    }
});

module.exports = mongoose.model("transaction", transactionSchema);