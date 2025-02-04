const { body } = require("express-validator");
const queries = require("../prisma/queries");
const validateUser = [
    body("username").trim()
    .notEmpty().withMessage("Username is required")
    .isLength({min: 3}).withMessage("Username must be at least 3 characters long")
    .isAlphanumeric().withMessage("Username must only contain letters and numbers")
    .custom(async (value) => {
        const registeredUser = await queries.findUser(value);
        if (registeredUser) {
            throw new Error("Username already in use")
        } else {
            return true;
        }
    }),

    body("password").trim()
    .notEmpty.withMessage("Password required")
    .isLength({min: 4}).withMessage("Password must be at least 4 characters long")

]

module.exports = validateUser;