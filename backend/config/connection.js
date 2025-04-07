const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'blog',
  password: '1234',
  port: 5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL bağlantısı başarılı'))
  .catch(err => console.error('Bağlantı hatası', err));

module.exports = pool;
