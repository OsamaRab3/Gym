const jwt = require("jsonwebtoken");
const environment = require('../config/environment')

const generateJWT = (user)=>{

    const token = jwt.sign({
        id: user.id,
        name: user.name,
        role: user.role
    },environment.JWT_SECRET,
    {
        expiresIn:environment.expiresIn
    })
    return token
}

module.exports = generateJWT;