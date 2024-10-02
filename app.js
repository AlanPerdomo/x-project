const { Pool } = require('pg');
const pool = new Pool({
   connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
       console.error('Erro ao conectar ao banco de dados', err);
    } else {
       console.log('Conexão bem-sucedida:', res.rows);
    }
 });