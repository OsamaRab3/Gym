// Business logic services 

const bcrypt = require("bcryptjs");
const prisma = require("../prisma/prisma")
const CustomError = require('../errors/CustomError')
const generateJWT = require('../utils/jwt')

const login = async (email, password) => {


// const hashedPassword = await bcrypt.hash("123456", 10); 
// await prisma.user.create({
//   data: {
//     name: "osama",
//     email: "osama@admin.com",
//     password: hashedPassword,
//     role: "ADMIN"
//   }
// });
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (!user) {
        throw new CustomError('invalid_email_or_password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new CustomError('invalid_email_or_password', 401);
    }

    const { password: p, createdAt: ca, ...safeUser } = user;
    // console.log(safeUser)
    const token = generateJWT(safeUser);
    return { safeUser, token };

}


module.exports = {
    login,

}