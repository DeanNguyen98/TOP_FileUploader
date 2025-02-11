const express = require("express");
const router = express.Router();
const multer = require("multer");
const queries = require("../prisma/queries");
const { Prisma } = require("@prisma/client");
const folderRoute = require("./folder");
const supabase = require("../prisma/supabase");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/login");
}

router.get("/", isAuthenticated, async (req, res) => {
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

//----------User upload file -------------//

router.post('/upload', upload.single('uploaded_file'), async (req,res) => {
        try {
            if (!req.file) {
                return res.status(400).json({error: "No file uploaded"});
            } else {
                const fileName = `${req.file.originalname}`;
                const filePath = `${req.user.id}/${fileName}`;
                const {data, error} = await supabase.storage
                .from("Fileuploader")
                .upload(filePath, req.file, {
                    contentType: req.file.mimetype
                });
                if (error) throw error;

                const supabaseResponse = supabase.storage
                .from("Fileuploader")
                .getPublicUrl(filePath);
                
                await queries.uploadFile(
                    fileName,
                    supabaseResponse.data.publicUrl,
                    req.user.id,
                    null
                )
                res.redirect("/user");
            }
        } catch(err) {
            console.error("Upload error:", err);
        }
})

//------------------------------//

//------------user create folder ------------//
router.post("/createFolder", async (req, res) => {
    const { folderName } = req.body;
    try {
        const folder = await queries.createFolder(folderName, req.user.id);
        res.redirect("/user");
    } catch(err) {
        console.log("error creating folder", err);
    }
})

router.use("/folder", folderRoute)

module.exports = router;