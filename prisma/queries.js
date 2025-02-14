const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    //--------------USER QUERIES -----------//
   registerUser: async (name,hash, salt) => {
        try {
            const user = await prisma.user.create({
                data: {
                    username: name,
                    hash: hash,
                    salt: salt
                }
            })
            return user;
        } catch(e) {
            console.log("error creating user:", e)
        }
        
   },
   findUser: async (username) => {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        return user;
   },

   findUserbyId: async(id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        //include folder and files for deserializeUser()
        include: {
            folders: {orderBy : {createdAt: "asc"}},
            files: true,
        }
    })
    return user;
   },

   //-------------FOLDER QUERIES -------------//
   createFolder: async(folderName, userId) => {
    try {
        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                ownerId: userId
            }
        });
        return folder
    } catch(err) {
        console.error("Error creating folder", err)
        throw err;
    }
   },
   findFolder: async(folderId) => {
    try {
        const folder = await prisma.folder.findUnique({
            where: {
                id: folderId
            },
            include: {
                files: true
            }
        })
        return folder;
    } catch(err) {
        console.error("error fetching folder", err);
        throw err;
    }
   },
   findAllFolder: async() => {
    try {
        const folders = await prisma.folder.findMany();
        return folders;
    } catch(err) {
        console.error("error retrieving folders", err)
        throw err;
    }
   },
   updateFolderName: async (newName, folderId) => {
    try {
        const updatedFolder = await prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                name: newName,
            }
        })
        return updatedFolder;
    } catch(err) {
        console.error("error updating folder", err);
        throw err;
    }
   },
   deleteFolder: async (folderId) => {
    try {
        await prisma.folder.delete({
            where: {
                id: folderId
            }
        })
    } catch(err) {

    }
   }, 
   //---------------FILE QUERIES -------//
   uploadFile: async(name, url, userId, folderId) => {
    try {
        const file = await prisma.file.create({
            data: {
                name: name,
                url: url,
                ownerId: userId,
                folderId: folderId,

            }
        })
        return file;
    } catch(err) {

    }
   }
}