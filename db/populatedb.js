const { Client } = require('pg');
require('dotenv').config()

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL,
  firstname VARCHAR,
  lastname VARCHAR,
  membership VARCHAR,
  admin BOOL
  );

  CREATE TABLE IF NOT EXISTS messages (
  messageid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR,
  body VARCHAR,
  time TIMESTAMP DEFAULT NOW(),
  author INT
  );
`
async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
