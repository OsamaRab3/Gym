require('dotenv').config()


module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.MYSQL_URL || 'Your DB_URL',
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
    expiresIn: process.env.expiresIn,

    // insert here all .env variables 
}