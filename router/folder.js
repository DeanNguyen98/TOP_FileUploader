const express = require("express");
const router = express.Router();
const queries = require("../prisma/queries");
const supabase = require("../prisma/supabase");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:folderId",  async (req, res) => {
    const folderId = req.params.folderId;
    const folder = await queries.findFolder(folderId);
    res.render("userFolder", {
        folder: folder,
        user: req.user
    })
})

//--------------UPLOAD FILE --------------//
router.post("/:folderId/upload",upload.single('uploaded_file'), async(req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    } else {
        const timeStamp = Date.now();
        const fileName = `${timeStamp}_${req.file.originalname}`;
        const filePath = `${req.user.id}/${fileName}`;
        const {data, error} = await supabase.storage
        .from("Fileuploader")
        .upload(filePath, req.file, {
            contentType: req.file.mimetype
        })
        if (error) throw error;
        const supabaseRes = supabase.storage
        .from("Fileuploader")
        .getPublicUrl(filePath);
        await queries.uploadFile(
            fileName,
            supabaseRes.data.publicUrl,
            req.user.id,
            req.params.folderId
        )
        res.redirect(`/user/folder/${req.params.folderId}`);
    }
})

//--------------DELETE FILE------------//

router.post("/:folderId/deleteFile/:fileId", async (req, res) => {
    try {
        const userId = req.user.id;
        const file = await queries.findFile(req.params.fileId);
        const filePath = `${userId}/${file.name}`;
        const { error } = supabase.storage
        .from("Fileuploader")
        .remove([filePath]);
        if (error) throw error;
        await queries.deleteFile(req.params.fileId);
        res.redirect(`/user/folder/${req.params.folderId}`)
    } catch(err) {
        console.error(err);
    }
  
})

//------------ Render all folder ---------------//
router.get("/", async (req, res) => {
    const folders = await queries.findAllFolder(req.user.id);
    res.render("userAllFolder", {
        folders: folders
    })
})
module.exports = router;
