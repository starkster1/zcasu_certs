// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    address public student;
    address public institute;

    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(address indexed owner, uint indexed txIndex);
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

    struct Transaction {
        address to;
        uint value;
        bool executed;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    modifier onlyOwner() {
        require(msg.sender == student || msg.sender == institute, "Not an owner");
        _;
    }

    constructor(address _student, address _institute) {
        require(_student != _institute, "Student and institute cannot be the same");
        student = _student;
        institute = _institute;
    }

    function submitTransaction(address _to, uint _value) external onlyOwner {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            executed: false
        }));
        emit SubmitTransaction(msg.sender, transactions.length - 1);
    }

    function confirmTransaction(uint _txIndex) external onlyOwner {
        confirmations[_txIndex][msg.sender] = true;
        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint _txIndex) external onlyOwner {
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaction already executed");
        require(confirmations[_txIndex][student] && confirmations[_txIndex][institute], "Transaction not confirmed by both owners");

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}("");
        require(success, "Transaction failed");
        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
