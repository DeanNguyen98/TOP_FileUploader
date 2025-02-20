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

router.use("/folder", folderRoute)

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

//------------** USER FILE**------------------//

router.get('/:fileId', async(req, res) => {
    const file = await queries.findFile(req.params.fileId);
    res.render("userFile", {
        file: file
    })
})

router.post("/:fileId/download", async (req, res) => {
  try {
    const file = await queries.findFile(req.params.fileId);
    if (!file) return res.status(400).json({error: "File not found"});
    return res.redirect(file.url);
  } catch (err) {
    console.error("Download error:", err)
  }
})
//----------User upload file -------------//

router.post('/upload', upload.single('uploaded_file'), async (req,res) => {
        try {
            if (!req.file) {
                return res.status(400).json({error: "No file uploaded"});
            } else {
                const timeStamp = Date.now();
                const fileName = `${timeStamp}_${req.file.originalname}`;
                const filePath = `${req.user.id}/${fileName}`;
                const {data, error} = await supabase.storage
                .from("Fileuploader")
                .upload(filePath, req.file.buffer, {
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

router.post('/deleteFile/:fileId', async (req, res) => {
    try {
        const userId = req.user.id;
        const file = await queries.findFile(req.params.fileId);
        const filePath = `${userId}/${file.name}`;
        const {error } = await supabase.storage
        .from("Fileuploader")
        .remove([filePath]);
        if (error ) throw error;
        await queries.deleteFile(req.params.fileId);
        res.redirect("/user");
    } catch(err) {
        console.error("Error deleting file:", err);
    }
})

//------------------------------//

//------------** FOLDER UPLOAD/DELETE **------------------//


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

//---------user edit/delete folder ----------//

router.post("/deleteFolder/:folderId", async(req, res) => {
    const folderId = req.params.folderId;
    await queries.deleteFolder(folderId);
    res.redirect("/user")
})

router.post("/editFolder/:folderId" , async(req, res) => {
    const folderId = req.params.folderId;
    await queries.updateFolderName(req.body.folderName, folderId);
    res.redirect("/user");
})


module.exports = router;