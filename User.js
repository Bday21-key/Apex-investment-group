const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number,
    transactions: Array
});

module.exports = mongoose.model('User', userSchema);
