const express = require("express");
const router = express.Router();
const queries = require("../prisma/queries");
router.get("/:folderId",  async (req, res) => {
    const folderId = req.params.folderId;
    const folder = await queries.findFolder(folderId);
    res.render("userFolder", {
        folder: folder
    })
})

// Render all folder
router.get("/", async (req, res) => {
    const folders = await queries.findAllFolder();
    res.render("userAllFolder", {
        folders: folders
    })
})
module.exports = router;
