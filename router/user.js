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

router.get("/", isAuthenticated, (req, res) => {
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
        const folder = await queries.createFolder(folderName);
        const allFolder = await Prisma.folder.findMany();
        console.log(allFolder);
        return folder
    } catch(err) {
        console.log("error creating folder");
    }
})

module.exports = router;