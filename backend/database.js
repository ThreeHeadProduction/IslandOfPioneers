require('dotenv').config()
const { Client } = require('pg')

module.exports = {
    async checkLogin(username, password) {

        const client = new Client( {  
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        })

        await client.connect();

        const text = 'SELECT * FROM userdata WHERE name = $1 and password = $2'
        const values = [username, password] 

        const result = await client.query(text, values);

        await client.end()

        if (result.rowCount == 1)
        {
            return true
        }
        return false
    },
    
    register() {

    }
}
