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
            return {successful:true, data:{username:result.rows[0].name}}
        }
        return {successful:false}
    },
    
    async register(email, username) {

        const client = new Client( {  
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
        })

        await client.connect();

        const text = 'SELECT * FROM userdata WHERE email = $1 and username = $2'
        const values = [email, username]
        
        const result = await client.query(text, values);

        await client.end()

        if (result.rowCount == null)
        {
            return {successful:true, data:{username:result.rows[0].name}}
        }
        return {successful:false}

    }

}
