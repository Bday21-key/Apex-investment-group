const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(403);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
};

router.get('/', auth, (req, res) => {
    res.json({
        balance: req.user.balance,
        transactions: req.user.transactions
    });
});

router.post('/transfer', auth, async (req, res) => {
    const { to, amount } = req.body;
    const recipient = await User.findOne({ username: to });
    if (!recipient || req.user.balance < amount) return res.status(400).json({ message: "Invalid" });
    req.user.balance -= amount;
    recipient.balance += amount;
    req.user.transactions.push({ type: "Sent", amount, to });
    recipient.transactions.push({ type: "Received", amount, from: req.user.username });
    await req.user.save();
    await recipient.save();
    res.json({ message: "Transfer successful" });
});

module.exports = router;
