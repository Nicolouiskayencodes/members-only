const pool = require('./pool');

async function addMember(id) {
  await pool.query(`UPDATE users SET membership = 'member' WHERE id = ${id}`)
}

async function createMessage(title, body, author) {
  await pool.query(`INSERT INTO messages (title, body, author) VALUES ($1, $2, $3)`, [title, body, author])
}

async function getAllMessages() {
  const {rows} = await pool.query(`SELECT * FROM messages JOIN users ON messages.author = users.id;`)
  console.log(rows)
  return rows
}

module.exports = {addMember, createMessage, getAllMessages}