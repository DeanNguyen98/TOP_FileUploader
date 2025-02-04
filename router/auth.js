const express = require("express");
const router = express.Router();
const queries = require("../prisma/queries");

router.get("/login", (req, res) => {
    res.render("../views/Login");
})

router.get("/register", (req, res) => {
    res.render("Register");
})

router.post("/register", async (req, res) => {

    const user =  await queries.registerUser(req.body.username, req.body.password);
    console.log("user created", user)
    res.send("user created");
})

module.exports = router