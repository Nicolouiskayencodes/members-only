const pool = require('./pool');

async function addMember(id) {
  await pool.query(`UPDATE users SET membership = 'member' WHERE id = ${id}`)
}

async function createMessage(title, body, author) {
  await pool.query(`INSERT INTO messages (title, body, author) VALUES ($1, $2, $3)`, [title, body, author])
}

async function getAllMessages() {
  const {rows} = await pool.query(`SELECT * FROM messages JOIN users ON messages.author = users.id;`)
  return rows
}

async function createUser(username, password, firstname, lastname) {
  await pool.query("INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4)", [
    username,
    password,
    firstname,
    lastname
  ]);
}

async function findUser(name) {
  const {rows} = await pool.query(`SELECT * FROM users WHERE username = '${name}'`)
  return rows;
}

async function addAdmin(id) {
  await pool.query(`UPDATE users SET admin = true WHERE id = ${id}`)
}

async function deleteMessage(id) {
  await pool.query(`DELETE FROM messages WHERE messageid = ${id}`)
}

async function getMessage(id) {
  const {rows} = await pool.query(`SELECT * FROM messages JOIN users ON messages.author = users.id WHERE messageid = ${id};`)
  return rows;
}

module.exports = {addMember, createMessage, getAllMessages,createUser, findUser, addAdmin, deleteMessage, getMessage}