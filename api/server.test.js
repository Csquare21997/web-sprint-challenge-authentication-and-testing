const db = require('../data/dbConfig')
const Auth = require('./auth/auth-model')
const server = require('./server')
const request = require("supertest");


const userA = {username:"cvs", password:"pharmacy"}
const userB = {username:"gaint", password:"shopping"}

const jokesA = {id:"arc10Rf2g", joke:'boo'}
const jokesB = {id:"019hNf125", joke:'zoo'}


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});

describe('find function', () =>{
  test ('add user into the db', async () =>{
    await request(server).post("/api/auth/register").send(userA)
    const findUser = await Auth.find(userA.username)
  expect(findUser).toMatchObject({username:userA.username})
  })
})

describe('findBy', () => {
  test('resolves the user by the given id', async () =>{
    await request(server).post("/api/auth/register").send(userA) 
    const result = await Auth.findBy({username: userA.username})
    expect(result.username).toBe(userA.username)
  })
})

describe('add function', () => {
  beforeEach(async () => {
    await db('users').truncate();
  })
  const zoo = { username:'zoo', password:'key'}
  test('add a new user', async () =>{
    const result = await Auth.add(zoo)
    expect(result).toMatchObject(zoo)
  })
  test('add the username to the users table', async () => {
    await Auth.add(userB)
    const records = await db('users')
    expect(records).toHaveLength(1)

  })
})

describe('user resigster', ()=> {
  beforeEach(async () => {
    await db('users').truncate();
  })
  test('add a new user to the db', async () => {
    await request(server).post('/api/auth/register').send(userA);
    const user = await db("users").first()
    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("username")
    expect(user).toHaveProperty("password")
    expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
    expect(user.username).toBe(userA.username)

  })
})

describe('[POST] /api/auth/login', () => {
  beforeEach(async () => {
    await db("users").truncate();
    await request(server).post("/api/auth/register").send(userA);
  });
  test('login with proper user', async () =>{
  const res = await request(server).post('/api/auth/login').send(userA)
    expect(res.status).toBe(200);
  })
})








