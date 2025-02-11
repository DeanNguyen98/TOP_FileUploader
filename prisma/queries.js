const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
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
            folders: true,
            files: true,
        }
    })
    return user;
   },
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
   uploadFile: async(name, url, userId, ownerId) => {
    try {
        const file = await prisma.file.create({
            data: {
                name: name,
                url: url,
                userId: userId,
                folderId: folderId,

            }
        })
    } catch(err) {

    }
   }
}