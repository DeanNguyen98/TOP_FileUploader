const express = require("express");
const router = express.Router();
const queries = require("../prisma/queries");
const passport = require("passport");
const { validateUser } = require("../lib/validator");
const {validationResult} = require("express-validator");
const { genPassword } = require("../lib/authentication");

router.get("/login", (req, res) => {
    res.render("/Login");
})

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureMessage:true,
    }),
    (req, res) => {
        res.redirect("/user");
    }
    )

router.get("/register", (req, res) => {
    res.render("Register");
})

router.post("/register",validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("Register", {
            errors: errors.array()
        })
    }
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash
    const user =  await queries.registerUser(req.body.username, hash, salt);
    res.render("misc/successReg");
    
})


module.exports = router