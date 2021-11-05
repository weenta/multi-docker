const keys = require('./keys')
const express  = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const redis = require('redis')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})
 
pgClient.on('error', () => console.log('Lost PG connection'))

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

app.get('/', (req, res) => {
  res.send('Hi')
})

app.get('/values/all', async (req, res) => {
  try {
    const values = await pgClient.query('SELECT * from values')
    console.log(values)
    res.send(values.rows)
  } catch(error) {
    res.send(error)
  }
})

app.get('/values/current', async(req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if(parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }

  redisClient.hset('values', index, 'Nothing yet!')
  redisPublisher.publish('insert', index)
  try {
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
  } catch (error) {
    res.send(error)
    return
  }

  res.send({ working: true })
})

app.listen(5000, err => {
  console.log('Listening')
})