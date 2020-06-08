//faz possivel o uso do banco de dados usando linguaem javascript
import knex from 'knex';

const connection = knex({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'databs'
    }
});

export default connection;