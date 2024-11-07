const pool = require('./pool');

async function addMember(id) {
  await pool.query(`UPDATE users SET membership = 'member' WHERE id = ${id}`)
}

module.exports = {addMember}