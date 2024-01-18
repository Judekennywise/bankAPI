const Transaction = require('./../models/transactions.models')
const User = require('./../models/user.model')
const bcrypt = require('bcrypt');



const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN'
});

exports.deposit_funds = async function(req, res) {
    try {

        const { accountNumber,depositAmount, from } = req.body;
        //console.log(accountNumber)
        
        
        if (!(accountNumber && depositAmount && from)) {
            res.status(400).json("All input are required");
        }
        let user = await User.findOne({accountNumber});
        
        if (user === null) {
            res.status(404).json(`This User with account number ${accountNumber} does not exist`);
        }
        let referenceNumber = Math.floor(Math.random() * 20000000) + 111111111 ;
        user.accountBalance = user.accountBalance + depositAmount;
        //console.log(user.accountBalance)
        let transactionDetails = {
            transactionType: 'Deposit',
            accountNumber: accountNumber,
            sender: from,
            transactionAmount: depositAmount,
            referenceNumber: referenceNumber
        };
        await user.save();
        await Transaction.create(transactionDetails)
        let accountName = `${user.firstname} ${user.lastname}`
        res.status(201).json({
            "status": "successful",
            "Account name": accountName,
            "Deposit Ammount": formatter.format(depositAmount),
            "Reference Number": referenceNumber,
            "Account balance": formatter.format(user.accountBalance)
        });

    } catch (err) {
        return res.json({ message: err });
    }
}

exports.transfer_money = async function (req, res) {
    try {
      //console.log(req.user.transactionPin);
      const { accountNumber, transferAmount, remark, transactionPin } = req.body;
  
      // Validate transaction pin
      const isPinCorrect = await bcrypt.compare(transactionPin, req.user.transactionPin);
      //console.log(isPinCorrect)
      if (isPinCorrect === false) {
        return res.status(400).json("Incorrect Pin");
      }
  
      // Validate required inputs
      if (!(accountNumber && transferAmount && remark)) {
        return res.status(400).json("All input are required");
      }
  
      // Find beneficiary user
      const beneficiary = await User.findOne({ accountNumber });
      if (!beneficiary) {
        return res.status(400).json("User with this account number does not exist");
      }
  
      // Find current user
      const currentUser = await User.findById(req.user._id);
  
      // Validate sufficient funds
      if (transferAmount > currentUser.accountBalance || transferAmount <= 0) {
        return res.status(400).json("Invalid transfer amount or insufficient funds");
      }
  
      // Validate self-transfer
      if (currentUser.accountNumber === beneficiary.accountNumber) {
        return res.status(400).json("Sorry, you cannot send money to yourself");
      }
  
      // Perform the fund transfer
      beneficiary.accountBalance += transferAmount;
      currentUser.accountBalance -= transferAmount;
  
      // Generate reference number
      const referenceNumber = Math.floor(Math.random() * 20000000) + 111111111;
  
      // Create transaction details
      const transactionDetails = {
        transactionType: 'Transfer',
        accountNumber,
        remark,
        sender: currentUser.accountNumber,
        transactionAmount: transferAmount,
        referenceNumber,
      };
  
      // Save beneficiary, current user, and transaction details
      await Promise.all([beneficiary.save(), currentUser.save(), Transaction.create(transactionDetails)]);
  
      // Send success response
      res.status(201).json({
        status: "successful",
        "Account name": beneficiary.accountName, // Assuming accountName is a property of the beneficiary
        "Transfer Amount": formatter.format(transferAmount),
        "Reference Number": referenceNumber,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

exports.withdraw_money = async function(req, res) {
    try {
        const { withdrawAmount } = req.body;
        if (!withdrawAmount) {
            res.status(400).json("Please input the amount you'd like to withdraw");
        }
        let currentUser = await User.findById(req.user.user_id);
        if (withdrawAmount > currentUser.accountBalance) {
            res.status(400).json("Insufficient funds to make this withdrawal");
        }
        currentUser.accountBalance = currentUser.accountBalance - withdrawAmount;
        let transactionDetails = {
            transactionType: 'Withdraw',
            accountNumber: currentUser.accountNumber,
            description: `NIBSS withdrawal of ${formatter.format(withdrawAmount)}`,
            //sender: currentUser.accountNumber,
            transactionAmount: withdrawAmount
        };
        await currentUser.save();
        await Transaction.create(transactionDetails);
        res.status(200).json(`Withdrawal of ${formatter.format(withdrawAmount)} was successful`);
    } catch (e) {
        res.json({ message: e });
    }
}

exports.get_all_transactions = async (req, res) => {
    try{
        const transaction = await Transaction.find({});
            res.json(transaction);
        }catch(err){
         throw(err)
        }
};
