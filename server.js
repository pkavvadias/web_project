const express = require('express')
const bodyParser = require('body-parser')
const db = require('./apis')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/uploadHar', db.uploadHar)

app.listen(port,'0.0.0.0')//To run on all available interfaces
