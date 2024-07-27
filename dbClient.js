const { Pool } = require('pg');
require('dotenv').config();

const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT } = process.env;

(async () => {
  console.info('Creating connection pool to initialize database...');
  const pool = new Pool({ 
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: PG_PORT,
    multipleStatements: true,
    connectionLimit: 100,
    idleTimeoutMillis: 10000,
});

console.log(' Executing initdb command... Pool created');
pool.execute('CREATE SCHEMA IF NOT EXISTS records DEFAULT CHARACTER SET utf8 COLLATE utf8_BIN', (err, res) => {
  if (err) {
    console.error(`Error occurred in initdb: ${err}`);
    // must force exit the process
    process.exit(1);
  }
  console.into(`Successfully created database: ${JSON.stringify(res)}`);
});
pool.end((err) => {
  if (err) {
    console.error(`Could not close pool: ${err}`);
    // must force exit the process if connection pool cannot be closed
    process.exit(1);
  }
  });
})();


module.exports = Pool;