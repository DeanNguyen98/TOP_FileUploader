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
            folder: true,
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
   }
}