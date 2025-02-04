const path = require("node:path");
const express = require("express");
const queries = require("./prisma/queries")
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user")
const session = require("express-session")
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const { PrismaClient, Prisma } = require("@prisma/client");
const configurePassport = require("./config/passport");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true, 
            dbRecordIdFunction: undefined,
        })
    })
)
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

configurePassport(passport);




app.listen(3000, () => console.log("listening"));
