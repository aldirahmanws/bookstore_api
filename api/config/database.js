const {Client} = require('pg')

const db = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
})
db.connect()
module.exports = db