const express = require("express");
const router = express.Router();
const multer = require("multer");
const queries = require("../prisma/queries");
const { Prisma } = require("@prisma/client");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        
      cb(null, file.originalname + '-' + Date.now());
    }
  })

const upload = multer({ storage: storage });

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

router.get("/", isAuthenticated, async (req, res) => {
    // const user = await queries.findUser(req.user.username);
    // console.log(user);
    console.log(req.user);
    res.render("UserMain", {
        user: req.user
    });
})

router.get("/logout", isAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/auth/login");
    })
})

router.post('/upload', upload.single('uploaded_file'), (req,res) => {
    console.log(req.file, req.body);
})

router.post("/createFolder", async (req, res) => {
    const { folderName } = req.body;
    try {
        const folder = await queries.createFolder(folderName, req.user.id);
        console.log(folder);
        return folder;
    } catch(err) {
        console.log("error creating folder", err);
    }
})

module.exports = router;