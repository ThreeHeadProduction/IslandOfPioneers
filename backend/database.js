require('dotenv').config()
const { Client } = require('pg')

module.exports = {
    async checkLogin(username, password) {

        const client = new Client({
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

        if (result.rowCount == 1) {
            return { successful: true, data: { username: result.rows[0].name } }
        }
        return { successful: false }
    },

    async checkRegister(email, username, password) {

        const client = new Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        })


        try {
            await client.connect();
            console.log('Connected to the database');

            const text = 'SELECT * FROM userdata WHERE email = $1 or name = $2'
            const values = [email, username]

            const result = await client.query(text, values);
            console.log('Query successful:', result.rows);

            if (result.rowCount === 0) {
                const text = 'INSERT INTO userdata (name, password, email) Values ($1, $2, $3)'
                const values = [username, password, email]

                console.log("send to server", email + " " + username + " " + password)

                const result = await client.query(text, values);

                if (result) {
                    await client.end()
                    return { successful: true }
                }

            }

        } catch (error) {

            console.error('Error executing query:', error);
            return { successful: false }
        } finally {
            await client.end();
        }


        await client.connect();




    }

}
