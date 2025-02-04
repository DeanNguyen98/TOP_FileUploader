const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
   registerUser: async (name,password) => {
        try {
            const user = await prisma.user.create({
                data: {
                    username: name,
                    password: password
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
        }
    })
    return user;
   }
}