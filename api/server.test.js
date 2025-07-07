const db = require('../data/dbConfig')
// const Auth = require('./auth/auth-model')
const server = require('./server')
const { request } = require('./server')


const userA = {username:"cvs", password:"pharmacy"}
const userB = {username:"gaint", password:"shopping"}

const jokesA = {id:"arc10Rf2g", joke:'boo'}
const jokesB = {id:"019hNf125", joke:'zoo'}


test('sanity', () => {
  expect(true).toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});


describe('user resigster', ()=> {
  test('add a new user to the db', async () => {
    await request(server).get('/api/auth/register').send(userA);
    await db('users').insert(userA)
    const user = await db("users").first()
    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("username")
    expect(user).toHaveProperty("password")
    expect(user.password).toMatch()
    expect(user.username).toBe(userA.username)

  })
})





