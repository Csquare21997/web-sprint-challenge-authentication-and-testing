const db = require('../../data/dbConfig')


module.exports = {
    add,
    find,
    findBy,
    findById,
    
}
function find(username) {
    return db('users').where({username}).first()
  }
  
  function findBy(filter) {
    return db('users').where(filter).first()
  }

  async function add(user) {
    const [id] = await db('users').insert(user)
    return db('users').where({id}).first()
  
  }
  function findById(id) {
    return db('users')
      .where({ id })
      .first()
  }
