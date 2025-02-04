const express = require("express");
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

router.get("/", isAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.username}`);
})

module.exports = router;