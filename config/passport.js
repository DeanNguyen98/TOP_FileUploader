const LocalStrategy = require("passport-local").Strategy;
const queries = require("../prisma/queries");


//------- PASSPORT LOCAL STRATEGY SETUP-------//

module.exports = async (passport) => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await queries.findUser(username);
                if (!user) {
                    return done(null, false, {message:"Incorrect username"});
                }
                if (user.password !== password) {
                    return done(null, false, {message: "Incorrect password"})
                }
                return done(null, user);
            } catch(err) {
                console.log("Error fetching user from database");
                return done(err);
            }
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await queries.findUserbyId(id);
            done(null, user);
        } catch(err) {
            done(err);
        }
    })
}


